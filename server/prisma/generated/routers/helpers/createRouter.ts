import * as trpc from "@trpc/server";

import type { Context } from '../../../../src/context';

import trpcOptions from '../../../../src/trpcOptions';

export const t = trpc.initTRPC.context<Context>().create(trpcOptions);

export const publicProcedure = t.procedure;



