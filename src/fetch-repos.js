/*
 * Fetches a list of public repositories for a given GitHub user
 * and saves their full names to a JSON file.
 */

import dotenv from "dotenv";
import { Octokit } from "@octokit/core";
import service from "./config-loader.js"; // Assuming this module exports configuration like API token and username
import fs from "fs";

// Load environment variables from a .env file (if it exists).
dotenv.config();

// Initialize the Octokit client for interacting with the GitHub API.
// It uses the access token loaded from the 'service' module.
const octokit = new Octokit({
  auth: service.githubAccessToken,
});

async function fetchRepos() {
  try {
    const githubUsername = service.githubUsername;
    const outputFilename = "my-repos.json";

    // Ensure the GitHub username is configured.
    if (!githubUsername) {
      console.error("GitHub username is not configured in config-loader.js");
      return;
    }

    console.log(`Fetching repositories for user: ${githubUsername}...`);

    // Make a request to the GitHub API to get the user's repositories.
    // We are setting 'per_page' to 100 to retrieve the maximum number of results per page.
    // Note: This only fetches the first page of results. If the user has more than 100
    // repositories, you would need to implement pagination to fetch all of them.
    const response = await octokit.request(
      `GET /users/${githubUsername}/repos`,
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28", // Specify the desired GitHub API version.
        },
        per_page: 100,
        page: 1,
      }
    );

    // Extract the array of repository data from the API response.
    const repositoriesData = response.data;

    // Map the repository data to an array containing only the full names of the repositories.
    const repositoryFullNames = repositoriesData.map((repo) => repo.full_name);

    // Write the array of repository full names to a JSON file.
    fs.writeFileSync(
      outputFilename,
      JSON.stringify(repositoryFullNames, null, 2)
    );
    console.log(`Repository full names saved to ${outputFilename}`);
    console.log("Fetched Repositories:", repositoryFullNames);
  } catch (error) {
    const githubUsername = service.githubUsername;
    const errorFilename = "my-repos.json";

    console.error(
      "Error fetching repositories for user:",
      githubUsername,
      error
    );

    // If an error occurs, write the error message to the JSON file.
    fs.writeFileSync(
      errorFilename,
      JSON.stringify({ error: error.message }, null, 2)
    );
    console.error(`Error details saved to ${errorFilename}`);
  }
}

// Call the function to fetch repositories.
fetchRepos();
