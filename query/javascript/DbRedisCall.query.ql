/**
 * @name javascript-db-redis-call
 * @description /
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/db-redis-call
 */

import utils

from DbRedisCall dbRedisCall, string heuristicsTracing, int score
where heuristicsTracing = "" + computeDbRedisCallScoreIsRedisCall(dbRedisCall)
+ computeDbRedisCallScoreIsRedisCallWithStringFirstArgument(dbRedisCall)
+ computeDbRedisCallScoreHasRedisLikeReceiverName(dbRedisCall)
+ computeDbRedisCallScoreHasImport(dbRedisCall)
+ computeDbRedisCallScoreHasRedisClientAssignation(dbRedisCall)
+ computeDbRedisCallScoreIsReceiverLinkedToRedisClientAssignation(dbRedisCall)
and score = count(int i | i = heuristicsTracing.indexOf("R") | i)
and score > 0
select dbRedisCall, dbRedisCall.toStringDbRedisCall() + ";;" + score + ";;" + heuristicsTracing