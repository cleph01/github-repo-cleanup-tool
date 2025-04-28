# GitHub Repo Cleanup Script

This repository contains a script designed to help automate the cleanup and maintenance of GitHub repositories. It simplifies the process of managing outdated branches, removing unnecessary repositories, and ensuring your account remain organized.

## Prerequisites

- Node (version 14.x or higher) installed on your system.

- This script requires the `@octokit/core` package, which provides a modular and extensible way to interact with the GitHub API. Ensure that this dependency is installed in your project to enable API communication for repository cleanup operations.

### GitHub Credentials

To use this script, you need to provide your GitHub credentials:

- **Username**: Your GitHub account username.
- **Personal Access Token**: A token with the necessary permissions to manage repositories and branches. To get the access token, go to [this page](https://github.com/settings/tokens/new) and create a token that has the following permissions: `repo/public_repo` and `delete_repo`.

**_Ensure that your personal access token is stored securely and never shared publicly._**
**_Access Token only good for 30 days_**

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/cleph01/github-repo-cleanup-script.git
   cd github-repo-cleanup-script
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

1. Set up your GitHub environment variables in a .env file:

   ```bash
   GITHUB_ACCESS_TOKEN: "your_personal_access_token",
   GITHUB_USERNAME: "your_username"
   ```

2. There are different ways you can run the script:

   ```bash
   npm run start # node src/fetch-repos.js && node src/delete-repos.js
   npm run fetch # node src/fetch-repos.js
   npm run delete # node src/delete-repos.js
   npm run fetch-and-delete # node src/fetch-repos.js && node src/delete-repos.js",
   ```

3. **Important**:  
   The `delete-repos.js` script relies on the `repos-for-deletion.json` file. You must manually populate this file by selecting the repositories you want to delete from the `my-repos.js` file and copying them into `repos-for-deletion.json`.

## References:

**GitHub API Documentation:**

- https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user

**List repositories for a user in the GitHub API:**

- https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28

**Pagination in the GitHub API:**

- https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#example-using-the-octokitjs-pagination-method

**Delete a repositor**

- https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#delete-a-repository

**Octokit.js Documentation:**

- https://github.com/octokit/core.js#readme

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the script.

- Future Improvement:
  - Create a

## License

This project is licensed under the [MIT License](./LICENSE).

## Disclaimer

Use this script with caution. Ensure you have proper backups and permissions before running cleanup operations.
