'use server';

import { Repository } from '@/types/repository.types';
import { RepoDetails } from '@/types/github.types';
import * as githubService from './githubRepositoryService';
import * as gitlabService from './gitlabRepositoryService';
import { fetchGitLabRepository } from './gitlabApi';

/**
 * Fetches repository details based on the platform
 */
export const fetchRepoDetails = async (
  repository: Repository,
  accessToken: string,
  platform: string
): Promise<RepoDetails> => {
  if (platform === 'github') {
    return githubService.fetchRepoDetails(repository.owner.login, repository.name, accessToken);
  } else if (platform === 'gitlab') {
    // For GitLab, we need to get the project ID first
    const gitlabRepo = await fetchGitLabRepository(repository.name, accessToken);
    return gitlabService.fetchRepoDetails(gitlabRepo.id, accessToken);
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
};

/**
 * Fetches contributors for a repository based on the platform
 */
export const fetchContributors = async (
  repository: Repository,
  accessToken: string,
  platform: string
): Promise<string[]> => {
  if (platform === 'github') {
    return githubService.fetchContributors(repository.owner.login, repository.name, accessToken);
  } else if (platform === 'gitlab') {
    // For GitLab, we need to get the project ID first
    const gitlabRepo = await fetchGitLabRepository(repository.name, accessToken);
    return gitlabService.fetchContributors(gitlabRepo.id, accessToken);
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
};

/**
 * Fetches all repository files based on the platform
 */
export const fetchAllRepoFiles = async (
  repository: Repository,
  accessToken: string,
  platform: string,
  repoDetails: RepoDetails
) => {
  if (platform === 'github') {
    return githubService.fetchAllRepoFiles(
      repository.owner.login,
      repository.name,
      accessToken,
      repoDetails
    );
  } else if (platform === 'gitlab') {
    // For GitLab, we need to get the project ID first
    const gitlabRepo = await fetchGitLabRepository(repository.name, accessToken);
    return gitlabService.fetchAllRepoFiles(gitlabRepo.id, accessToken, repoDetails.language);
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
};
