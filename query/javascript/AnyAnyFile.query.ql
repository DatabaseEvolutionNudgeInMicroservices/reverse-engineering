/**
 * @name javascript-any-any-file
 * @description /
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/any-any-call
 */

import utils

from AnyAnyFile anyAnyFile, string heuristicsTracing, int score
where heuristicsTracing = "" + computeAnyAnyFileScoreIsAnyAnyFile(anyAnyFile)
and score = count(int i | i = heuristicsTracing.indexOf("A") | i)
and score > 0
select anyAnyFile, anyAnyFile.toStringAnyAnyFile() + ";;" + score + ";;" + heuristicsTracing