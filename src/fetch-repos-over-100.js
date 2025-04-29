/*
 * Fetches all pages of data from a specified GitHub API endpoint.
 * This function automatically handles pagination by examining the 'Link' header
 * in the API response to determine if there are more pages to fetch.
 */

import { Octokit } from "@octokit/core";
import service from "./config-loader.js"; // Assuming this module exports configuration like API token and username
import fs from "fs";

// Initialize the Octokit client for interacting with the GitHub API.
// It uses the access token loaded from the 'service' module.
const octokit = new Octokit({
  auth: service.githubAccessToken,
});

// Main asynchronous function to fetch and process repository data.
async function fetchAllRepos() {
  try {
    const githubUsername = service.githubUsername;
    if (!githubUsername) {
      console.error("GitHub username is not configured in config-loader.js");
      return;
    }

    const apiUrl = `/users/${githubUsername}/repos`;
    console.log(`Fetching repositories for user: ${githubUsername}...`);

    // Call the function to get all paginated repository data.
    const allReposData = await getPaginatedData(apiUrl);

    // Extract the full name of each repository from the fetched data.
    const repositoryNames = allReposData.map((repo) => repo.full_name);

    const outputFilename = "my-repos.json";
    // Write the array of repository names to a JSON file.
    fs.writeFileSync(outputFilename, JSON.stringify(repositoryNames, null, 2));
    console.log(`Repository names saved to ${outputFilename}`);

    // Optional: Log the raw data and extracted names for debugging.
    // console.log("Raw data:", allReposData);
    // console.log("Repository names:", repositoryNames);
  } catch (error) {
    console.error(
      "An error occurred while fetching or processing repositories:",
      error
    );

    const errorFilename = "my-repos.json";
    // If an error occurs, write the error message to the same JSON file.
    fs.writeFileSync(
      errorFilename,
      JSON.stringify({ error: error.message }, null, 2)
    );
    console.error(`Error details saved to ${errorFilename}`);
  }
}

// Call the main function to start the process.
fetchAllRepos();

/**
 * Fetches all pages of data from a given GitHub API URL that supports pagination.
 *
 * @param {string} url - The initial GitHub API URL to fetch data from.
 * This URL should point to a resource that supports pagination
 * via the 'Link' header.
 * @returns {Promise<Array<any>>} - A promise that resolves to an array containing
 * all the fetched data from all pages.
 */
async function getPaginatedData(url) {
  // Regular expression to extract the URL of the next page from the 'Link' header.
  const nextLinkRegex = /(?<=<)([\S]*)(?=>; rel="next")/i;
  let hasNextPage = true;
  let allData = [];
  let currentPageUrl = url;

  console.log(`Starting paginated fetch from: ${currentPageUrl}`);

  // Continue fetching data as long as there is a 'next' link in the response headers.
  while (hasNextPage) {
    console.log(`Fetching page: ${currentPageUrl}`);
    try {
      const response = await octokit.request(`GET ${currentPageUrl}`, {
        per_page: 100, // Request up to 100 items per page (GitHub's maximum).
        headers: {
          "X-GitHub-Api-Version": "2022-11-28", // Specify the desired GitHub API version.
        },
      });

      // Process the data from the current page.
      const currentPageData = parseData(response.data);
      allData = [...allData, ...currentPageData];
      console.log(`Fetched ${currentPageData.length} items from this page.`);

      // Check if there's a 'Link' header in the response, which indicates pagination.
      const linkHeader = response.headers.link;

      // If a 'Link' header exists and contains 'rel="next"', there are more pages.
      hasNextPage = linkHeader && linkHeader.includes(`rel="next"`);

      // If there's a next page, extract its URL from the 'Link' header.
      if (hasNextPage) {
        const match = linkHeader.match(nextLinkRegex);
        if (match && match[0]) {
          currentPageUrl = match[0];
          console.log(`Next page URL: ${currentPageUrl}`);
        } else {
          console.warn(
            "Could not extract next page URL from Link header:",
            linkHeader
          );
          hasNextPage = false; // Stop if the next URL can't be found.
        }
      } else {
        console.log("No more pages to fetch.");
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      hasNextPage = false; // Stop fetching if an error occurs.
      throw error; // Re-throw the error to be caught by the main function.
    }
  }

  console.log(`Successfully fetched a total of ${allData.length} items.`);
  return allData;
}

/**
 * Helper function to normalize the structure of the data received from the GitHub API.
 * Different API endpoints might return data in slightly different formats.
 * This function ensures that we consistently get an array of the desired items.
 *
 * @param {any} data - The data object or array received from the GitHub API.
 * @returns {Array<any>} - An array containing the desired data items.
 */
function parseData(data) {
  // If the data is already an array, return it directly.
  if (Array.isArray(data)) {
    return data;
  }

  // Some GitHub API endpoints return a 204 No Content status with no data,
  // or an object where the actual array of items is nested under a key.
  if (!data) {
    return [];
  }

  // If the data is an object, we need to find the key that holds the array of items.
  const keys = Object.keys(data);

  // Remove common metadata keys that don't contain the actual data array.
  delete data.incomplete_results;
  delete data.repository_selection;
  delete data.total_count;

  // After deleting metadata, if there's only one key left, assume it holds the array.
  const remainingKeys = Object.keys(data);
  if (remainingKeys.length === 1) {
    const namespaceKey = remainingKeys[0];
    return data[namespaceKey] || []; // Return the array if it exists, otherwise an empty array.
  }

  // If we can't determine the array key, return an empty array to prevent errors.
  console.warn(
    "Could not determine the data array key in the API response:",
    data
  );
  return [];
}
