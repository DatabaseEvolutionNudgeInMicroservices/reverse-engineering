/**
 * @name javascript-db-mongo-call
 * @description /
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/db-mongo-call
 */

import utils

from DbMongoCall dbMongoCall, string heuristicsTracing, int score
where heuristicsTracing = "" + computeDbMongoCallScoreIsMongoCall(dbMongoCall)
+ computeDbMongoCallScoreIsMongoCallWithObjectOrOrArrayStringFirstArgument(dbMongoCall)
+ computeDbMongoCallScoreHasMongoLikeReceiverName(dbMongoCall)
+ computeDbMongoCallScoreHasImport(dbMongoCall)
+ computeDbMongoCallScoreHasMongoClientAssignation(dbMongoCall)
+ computeDbMongoCallScoreIsReceiverLinkedToMongoClientAssignation(dbMongoCall)
and score = count(int i | i = heuristicsTracing.indexOf("M") | i)
and score > 0
select dbMongoCall, dbMongoCall.toStringDbMongoCall() + ";;" + score + ";;" + heuristicsTracing