import { EntityManager, Repository } from 'typeorm';

export function getRepo<T>(
  defaultRepo: Repository<T>,
  manager?: EntityManager
): Repository<T> {
  if (manager) {
    return manager.getRepository(defaultRepo.target);
  }
  return defaultRepo;
}
