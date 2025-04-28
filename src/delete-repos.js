/*
 * Deletes a list of GitHub repositories specified in the 'repos-for-deletion.json' file.
 * It reads the list of repositories, then attempts to delete each one using the GitHub API.
 * The results of each deletion attempt (success or failure) are logged to the console
 * and appended to the 'deleted-repos.json' file.
 */

import { Octokit } from "@octokit/core";
import service from "./config-loader.js"; // Assuming this module exports the GitHub username and access token
import fs from "fs";

// Read the list of repositories to be deleted from the 'repos-for-deletion.json' file.
// If the file doesn't exist or is empty, reposForDeletion will be null or an empty array.
const reposForDeletion = JSON.parse(
  fs.readFileSync("./src/repos-for-deletion.json")
);

// Initialize the Octokit client for interacting with the GitHub API.
// It uses the access token loaded from the 'config-loader' module.
const octokit = new Octokit({
  auth: service.githubAccessToken,
});

console.log(
  `Attempting to delete ${
    reposForDeletion ? reposForDeletion.length : 0
  } repositories.`
);

// Iterate over the list of repositories to be deleted.
// Using a traditional for...of loop to handle asynchronous operations sequentially.
async function deleteRepositories() {
  if (!reposForDeletion) {
    console.log("No repositories found in repos-for-deletion.json.");
    return;
  }

  // Create variable to store the output filename for logging deletion results.
  // This file will contain the status of each deletion attempt.
  const outputFilename = "deleted-repos.json";

  // Loop through each repository full name in the list.
  for (const repoFullName of reposForDeletion) {
    // Split the repository full name (owner/repo) into its owner and repository name components.
    const [owner, repoName] = repoFullName.split("/");

    // Check if the repository full name is in the expected 'owner/repo' format.
    if (!owner || !repoName) {
      console.error(
        `Invalid repository format: "${repoFullName}". Expected 'owner/repo'. Skipping.`
      );
      continue; // Move to the next repository in the list.
    }

    console.log(`Initiating deletion for repository: ${repoName}`);

    try {
      // Initiate the deletion process using the GitHub API.
      const response = await octokit.request(
        `DELETE /repos/${owner}/${repoName}`,
        {
          owner: owner,
          repo: repoName,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28", // Specify the desired GitHub API version.
          },
        }
      );

      // Create an entry to log the deletion status.
      const deletionEntry = { repo: repoName, status: response.status };

      // Append the deletion status to the 'deleted-repos.json' file.
      fs.appendFileSync(
        outputFilename,
        JSON.stringify(deletionEntry, null, 2) + ",\n"
      ); // Added newline for better readability in the file.

      console.log(
        `Deletion successful for repository: ${repoName} - Status: ${response.status}`
      );
      console.log(deletionEntry);
    } catch (error) {
      console.error(`Error deleting repository: ${repoName}`, error);

      // Append the error details to the 'deleted-repos.json' file.
      fs.appendFileSync(
        "deleted-repos.json",
        JSON.stringify({ repo: repoName, error: error.message }, null, 2) +
          ",\n" // Added newline for better readability in the file.
      );
    }
  }

  console.log("Repository deletion process completed.");
}

// Execute the asynchronous deletion function.
deleteRepositories();
