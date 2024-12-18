/**
 * @name javascript-api-express-call
 * @description /
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/api-express-call
 */

import utils

from ApiExpressCall apiExpressCall, string heuristicsTracing, int score
where heuristicsTracing = "" + computeApiExpressCallScoreIsApiExpressCall(apiExpressCall)
+ computeApiExpressCallScoreIsApiExpressCallStringFirstArgument(apiExpressCall)
+ computeApiExpressCallScoreIsApiExpressCallStringFirstArgumentApiRouteLike(apiExpressCall)
+ computeApiExpressCallScoreIsApiExpressCallFunctionSecondArgument(apiExpressCall)
+ computeApiExpressCallScoreHasApiLikeReceiverName(apiExpressCall)
+ computeApiExpressCallScoreHasImportApi(apiExpressCall)
+ computeApiExpressCallScoreHasApiExpressAssignation(apiExpressCall)
+ computeApiExpressCallScoreIsReceiverLinkedToApiExpressAssignation(apiExpressCall)
and score = count(int i | i = heuristicsTracing.indexOf("E") | i)
and score > 0
select apiExpressCall, apiExpressCall.toStringApiExpressCall() + ";;" + score + ";;" + heuristicsTracing