import dotenv from "dotenv";
dotenv.config();
let service = {};

service.githubUsername = process.env.GITHUB_USERNAME;
service.githubAccessToken = process.env.GITHUB_ACCESS_TOKEN;

export default service;
