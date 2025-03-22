import { t, publicProcedure } from "./helpers/createRouter";
import { TaskAggregateSchema } from "../schemas/aggregateTask.schema";
import { TaskCreateOneSchema } from "../schemas/createOneTask.schema";
import { TaskDeleteManySchema } from "../schemas/deleteManyTask.schema";
import { TaskDeleteOneSchema } from "../schemas/deleteOneTask.schema";
import { TaskFindFirstSchema } from "../schemas/findFirstTask.schema";
import { TaskFindManySchema } from "../schemas/findManyTask.schema";
import { TaskFindUniqueSchema } from "../schemas/findUniqueTask.schema";
import { TaskGroupBySchema } from "../schemas/groupByTask.schema";
import { TaskUpdateManySchema } from "../schemas/updateManyTask.schema";
import { TaskUpdateOneSchema } from "../schemas/updateOneTask.schema";
import { TaskUpsertSchema } from "../schemas/upsertOneTask.schema";

export const tasksRouter = t.router({
  aggregateTask: publicProcedure
    .input(TaskAggregateSchema).query(async ({ ctx, input }) => {
      const aggregateTask = await ctx.prisma.task.aggregate(input);
      return aggregateTask;
    }),
  createOneTask: publicProcedure
    .input(TaskCreateOneSchema).mutation(async ({ ctx, input }) => {
      const createOneTask = await ctx.prisma.task.create(input);
      return createOneTask;
    }),
  deleteManyTask: publicProcedure
    .input(TaskDeleteManySchema).mutation(async ({ ctx, input }) => {
      const deleteManyTask = await ctx.prisma.task.deleteMany(input);
      return deleteManyTask;
    }),
  deleteOneTask: publicProcedure
    .input(TaskDeleteOneSchema).mutation(async ({ ctx, input }) => {
      const deleteOneTask = await ctx.prisma.task.delete(input);
      return deleteOneTask;
    }),
  findFirstTask: publicProcedure
    .input(TaskFindFirstSchema).query(async ({ ctx, input }) => {
      const findFirstTask = await ctx.prisma.task.findFirst(input);
      return findFirstTask;
    }),
  findFirstTaskOrThrow: publicProcedure
    .input(TaskFindFirstSchema).query(async ({ ctx, input }) => {
      const findFirstTaskOrThrow = await ctx.prisma.task.findFirstOrThrow(input);
      return findFirstTaskOrThrow;
    }),
  findManyTask: publicProcedure
    .input(TaskFindManySchema).query(async ({ ctx, input }) => {
      const findManyTask = await ctx.prisma.task.findMany(input);
      return findManyTask;
    }),
  findUniqueTask: publicProcedure
    .input(TaskFindUniqueSchema).query(async ({ ctx, input }) => {
      const findUniqueTask = await ctx.prisma.task.findUnique(input);
      return findUniqueTask;
    }),
  findUniqueTaskOrThrow: publicProcedure
    .input(TaskFindUniqueSchema).query(async ({ ctx, input }) => {
      const findUniqueTaskOrThrow = await ctx.prisma.task.findUniqueOrThrow(input);
      return findUniqueTaskOrThrow;
    }),
  groupByTask: publicProcedure
    .input(TaskGroupBySchema).query(async ({ ctx, input }) => {
      const groupByTask = await ctx.prisma.task.groupBy({ where: input.where, orderBy: input.orderBy, by: input.by, having: input.having, take: input.take, skip: input.skip });
      return groupByTask;
    }),
  updateManyTask: publicProcedure
    .input(TaskUpdateManySchema).mutation(async ({ ctx, input }) => {
      const updateManyTask = await ctx.prisma.task.updateMany(input);
      return updateManyTask;
    }),
  updateOneTask: publicProcedure
    .input(TaskUpdateOneSchema).mutation(async ({ ctx, input }) => {
      const updateOneTask = await ctx.prisma.task.update(input);
      return updateOneTask;
    }),
  upsertOneTask: publicProcedure
    .input(TaskUpsertSchema).mutation(async ({ ctx, input }) => {
      const upsertOneTask = await ctx.prisma.task.upsert(input);
      return upsertOneTask;
    }),

}) 
