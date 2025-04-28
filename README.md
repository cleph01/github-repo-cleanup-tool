# GitHub Repository Management Script

This repository contains scripts to help you manage your GitHub repositories, specifically for fetching a list of your repositories and deleting selected ones.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js**: Version 14.x or higher is required. You can download it from [nodejs.org](https://nodejs.org/).
- **npm (Node Package Manager)**: This comes bundled with Node.js. You'll use it to install dependencies.

### GitHub Credentials

To interact with the GitHub API, you'll need to provide your GitHub credentials:

- **GitHub Username**: Your GitHub account username.
- **Personal Access Token (PAT)**: A security token that allows the script to access your GitHub account. Follow these steps to create one:

  1. Go to your GitHub account settings: [https://github.com/settings/tokens](https://github.com/settings/tokens)
  2. Click on **Generate new token** (or **Generate new token (classic)**).
  3. Give your token a descriptive name (e.g., "GitHub Repo Cleanup Script").
  4. **Crucially, select the following scopes (permissions) for the token:**
     - `repo` (This grants access to public and private repositories.)
     - `delete_repo` (This allows the script to delete repositories.)
  5. Click **Generate token**.
  6. **Copy the generated token and store it securely.** You will need to add it to your `.env` file in the next step.

  **Important Security Notes:**

  - **Treat your Personal Access Token like a password.** Never share it publicly, commit it to your repository, or expose it in client-side code.
  - **Be aware that the generated Access Token has the permissions you granted it.** Only grant the necessary permissions for the script to function.
  - **While the documentation mentions a 30-day validity for some tokens, Personal Access Tokens you create manually generally do not expire unless you revoke them.** However, it's good practice to review your tokens periodically.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/cleph01/github-repo-cleanup-tool.git
   cd github-repo-cleanup-tool
   ```

2. **Install the required dependencies:**

```Bash

npm install
```

This command will install the @octokit/core package, which is used to communicate with the GitHub API.

## Usage

The script consists of two main parts: fetching your repositories and deleting selected ones.

**1. Configure Environment Variables**

You need to create a .env file in the root of your project to store your GitHub credentials securely.

- Create a .env file:

```Bash

touch .env
```

- Edit the .env file and add your GitHub username and the Personal Access Token you generated earlier:

```Code snippet

GITHUB_ACCESS_TOKEN = your_personal_access_token
GITHUB_USERNAME = your_username
```

Replace `your_personal_access_token` and `your_username` with your actual credentials.

**2. Running the Scripts**

The `package.json` file includes several npm scripts to run the different parts of the process:

- `npm run start`: Runs both the fetch-repos.js script (to get your repository list) followed by the delete-repos.js script (to delete selected repositories).
- `npm run fetch`: Executes only the fetch-repos.js script. This script fetches a list of your repositories and saves their full names to a file named my-repos.json.
- `npm run delete`: Executes only the delete-repos.js script. Important: This script relies on a file named repos-for-deletion.json which you need to manually create and populate (see the next step).
- `npm run fetch-and-delete`: This is an alias for npm run start, running both scripts sequentially.

## Step-by-Step Instructions:

**1. Fetch your list of repositories:**

Run the following command to fetch a list of your GitHub repositories:

```Bash

npm run fetch
```

This will create a file named my-repos.json in the root of your project containing a list of your repository full names (e.g., "cleph01/my-awesome-repo").

**2. Select repositories for deletion:**

- Manually create a new file named `repos-for-deletion.json` in the root of your project.
- Open both `my-repos.json` and `repos-for-deletion.json` in a text editor.
- Carefully review the list in `my-repos.json` and copy the full names of the repositories you want to delete into the `repos-for-deletion.json` file. The `repos-for-deletion.json` file should contain a JSON array of strings, like this example:

```JSON

[
"cleph01/repo-to-delete-1",
"cleph01/another-repo"
]
```

- Double-check the `repos-for-deletion.json` file to ensure you have only included the repositories you intend to delete. Deleting a repository is a permanent action!

**3. Delete the selected repositories:**

Once you have populated the repos-for-deletion.json file with the repositories you want to remove, run the following command:

```Bash

npm run delete
```

The script will then attempt to delete each repository listed in repos-for-deletion.json. The results of each deletion attempt (success or failure) will be logged to the console and also saved in a file named `deleted-repos.json`.

Alternatively, you can run both steps sequentially with:

```Bash

npm run start
```

or

```Bash

npm run fetch-and-delete
```

However, it is highly recommended to run `npm run fetch` first, carefully review and populate `repos-for-deletion.json`, and then run `npm run delete` separately to avoid accidental data loss.

## References

**GitHub API Documentation:**

- **List repositories for a user:** https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
- **Using pagination in the REST API:** https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28
- **Example using the Octokit.js pagination method:** https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#example-using-the-octokitjs-pagination-method
- **Delete a repository:** https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#delete-a-repository
- **Octokit.js Documentation:** https://github.com/octokit/core.js#readme

## Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open issues or submit pull requests.

**Future Improvement:**

- Consider adding functionality to delete outdated branches.
- Explore options for a more interactive way to select repositories for deletion.

## License

This project is licensed under the MIT License.

## Disclaimer

Use this script with extreme caution. Deleting repositories is a permanent and irreversible action. Always ensure you have proper backups or are absolutely certain about the repositories you are deleting before running the delete script. The authors and contributors of this script are not responsible for any data loss that may occur.
