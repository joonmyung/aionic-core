import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { Project } from '@components/project/model'

export class TaskProjectController {
  private readonly taskProjectRepo: Repository<Project> = getManager().getRepository('Project')

  /**
   * Read all projects from a certain task from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readTaskProjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { taskId } = req.params

      if (!taskId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const projects: Project[] = await this.taskProjectRepo
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.author', 'user')
        .innerJoinAndSelect('project.tasks', 'task', 'task.id = :id', { id: taskId })
        .getMany()

      return res.json({ status: res.statusCode, data: projects })
    } catch (err) {
      return next(err)
    }
  }
}