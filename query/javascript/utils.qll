import javascript
import DataFlow

// ==================================================================================================================================================
// ---------------------------------------------------------------------- Node ----------------------------------------------------------------------
// ==================================================================================================================================================

string toStringChildToParentChain(AstNode node) {
	if node.getParent() instanceof TopLevel
	then result = node + "" // Base case.
	else result = toStringChildToParentChain(node.getParent()) + " -> " + node // Recursive case.
}

// ==================================================================================================================================================
// ------------------------------------------------------------------- Operation --------------------------------------------------------------------
// ==================================================================================================================================================

string toStringOperationType(CallExpr call) {

	// API Express

	if call instanceof ApiExpressCall and call.getCalleeName() in [
		"post"
	]
	then result = "CREATE"

	else if call instanceof ApiExpressCall and call.getCalleeName() in [
		"get",
		"all",
		"head"
	]
	then result = "READ"

	else if call instanceof ApiExpressCall and call.getCalleeName() in [
		"put",
		"patch"
	]
	then result = "UPDATE"

	else if call instanceof ApiExpressCall and call.getCalleeName() in [
		"delete",
		"del"
	]
	then result = "DELETE"

	// DB Redis

	else if call instanceof DbRedisCall and call.getCalleeName() in [
		"rpush"
	]
	then result = "CREATE"

	else if call instanceof DbRedisCall and call.getCalleeName() in [
		"get",
		"keys",
		"smembers",
		"scanStream",
		"scan",
		"mget",
		"llen",
		"lrange",
		"exists",
		"hgetall",
		"zrange",
		"zrangebyscore",
		"zcard",
		"strlen"
	]
	then result = "READ"

	else if call instanceof DbRedisCall and call.getCalleeName() in [
		"set",
		"setex",
		"sadd",
		"hset",
		"setnx",
		"mset",
		"zadd",
		"lset",
		"expire",
		"pexpire",
		"ltrim",
		"lrem"
	]
	then result = "UPDATE"

	else if call instanceof DbRedisCall and call.getCalleeName() in [
		"del",
		"srem",
		"flushdb",
		"zremrangebyrank"
	]
	then result = "DELETE"

	// DB MongoDB

	else if call instanceof DbMongoCall and call.getCalleeName() in [
		"bulkWrite",
		"insert",
		"insertMany",
		"insertOne",
		"save"
	]
	then result = "CREATE"

	else if call instanceof DbMongoCall and call.getCalleeName() in [
		"collection",
		"aggregate",
		"count",
		"countDocuments",
		"distinct",
		"estimatedDocumentCount",
		"find",
		"findOne",
		"geoHaystackSearch",
		"group",
		"isCapped",
		"mapReduce",
		"options",
		"parallelCollectionScan",
		"stats",
		"watch"
	]
	then result = "READ"

	else if call instanceof DbMongoCall and call.getCalleeName() in [
		"findAndModify",
		"findOneAndReplace",
		"findOneAndUpdate",
		"replaceOne",
		"update",
		"updateMany",
		"updateOne",
		"rename"
	]
	then result = "UPDATE"

	else if call instanceof DbMongoCall and call.getCalleeName() in [
		"deleteMany",
		"deleteOne",
		"drop",
		"findAndRemove",
		"findOneAndDelete",
		"remove"
	]
	then result = "DELETE"

	else if call instanceof AnyAnyCall
	then result = "OTHER"

	else
	result = "OTHER"
}

// ==================================================================================================================================================
// ------------------------------------------------------------------- Expression -------------------------------------------------------------------
// ==================================================================================================================================================

class Expression extends Expr {

	string toStringExpression() {
		result = "..."
	}
}

class LiteralExpression extends Expression, Literal {

	override string toStringExpression() {
		result = "'"+this.getValue().replaceAll("\n", "")+"'"
	}
}

class TemplateLiteralExpression extends Expression, TemplateLiteral {

	override string toStringExpression() {
		if this.getNumElement() = 0
		then result = "``"
		else
		result = "`" + this.toStringElement(this.getNumElement()-1) + "`"
	}

	string toStringElement(int n) {
		n in [0 .. 100] and
		// Recursive case.
		if n > 0
		then result = this.toStringElement(n-1) + " " + this.getElement(n).(Expression).toStringExpression()
		// Base case.
		else
		result = this.getElement(n).(Expression).toStringExpression()
	}
}

class TemplateElementExpression extends Expression, TemplateElement {

	override string toStringExpression() {
		result = "'"+this.getRawValue().replaceAll("\n", "")+"'"
	}
}

class IdentifierExpression extends Expression, Identifier {

	override string toStringExpression() {
		result = this.getName()
	}
}

class DotExpression extends Expression, DotExpr {

	override string toStringExpression() {
		if this.getNumChild() = 0
		then result = ""
		else
		result = this.toStringChild(this.getNumChild()-1) + ""
	}

	string toStringChild(int n) {
		n in [0 .. 100] and
		// Recursive case.
		if n > 0
		then result = this.toStringChild(n-1) + "." + this.getChildExpr(n).(Expression).toStringExpression()
		// Base case.
		else
		result = this.getChildExpr(n).(Expression).toStringExpression()
	}
}

class IndexExpression extends Expression, IndexExpr {

	override string toStringExpression() {
		result = this.getBase() + "[" + this.getIndex() + "]"
	}
}

class ConcatenationExpression extends Expression, AddExpr {

	override string toStringExpression() {
		result = this.toStringOperand(this.getLeftOperand()) + " + " +  this.toStringOperand(this.getRightOperand())
	}

	string toStringOperand(Expr operand) {
		result = operand.(Expression).toStringExpression()
	}
}

class ObjectExpression extends Expression, ObjectExpr {

	override string toStringExpression() {
		if this.getNumProperty() = 0
		then result = "{}"
		else
		result = "{ " + this.toStringObjectMember(this.getNumProperty()-1) + " }"
	}

	string toStringObjectMember(int n) {
		n in [0 .. 100] and
		// Recursive case.
		if n > 0
		then result = this.toStringObjectMember(n-1) + ", " + this.toStringProperty(this.getProperty(n))
		// Base case.
		else
		result = this.toStringProperty(this.getProperty(n))
	}

	string toStringProperty(Property property) {
		if property instanceof SpreadProperty
		then result = property.toString()
		else if property instanceof ValueProperty
		then result = property.getNameExpr().(Expression).toStringExpression() + " : " + property.getInit().(Expression).toStringExpression()
		else result = "..."
	}
}

class ArrayExpression extends Expression, ArrayExpr {

	override string toStringExpression() {
		if this.getSize() = 0
		then result = "[]]"
		else
		result = "[" + this.toStringElement(this.getSize()-1) + "]"
	}

	string toStringElement(int n) {
		n in [0 .. 100] and
		// Recursive case.
		if n > 0
		then result = this.toStringElement(n-1) + ", " + this.getElement(n).(Expression).toStringExpression()
		// Base case.
		else
		result = this.getElement(n).(Expression).toStringExpression()
	}
}

class CallExpression extends Expression, CallExpr {

	override string toStringExpression() {
		if this.getNumArgument() = 0
		then result = this.getCalleeName() + "()"
		else
		result = this.getCalleeName() + "(" + this.toStringArgument(this.getNumArgument()-1) + ")"
	}

	string toStringArgument(int n) {
		n in [0 .. 100] and
		// Recursive case.
		if n > 0
		then result = this.toStringArgument(n-1) + ", " + this.getArgument(n).(Expression).toStringExpression()
		// Base case.
		else
		result = this.getArgument(n).(Expression).toStringExpression()
	}
}

// Kind of type in CodeQL:
// 0  = identifier ;
// 1  = 'null' ;
// 2  = boolean ;
// 3  = int ;
// 4  = string ;
// 5  = regex ;
// 6  = 'this' ;
// 7  = array ;
// 8  = object ;
// 9  = function.

predicate isString(Expr expr) {
	expr.getKind() = 4 or expr.getKind() = 71 // 4 = only string ; 71 = template string (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).
}

predicate isFunction(Expr expr) {
	expr.getKind() = 9 or expr.getKind() = 13 or expr.getKind() = 14  or expr.getKind() = 65 or expr.getKind() = 79 // 9 = function definition, 13 = static function call, 9 = method call, 65 = anonymous function call, 79 = function definition by variable.
}

predicate isObject(Expr expr) {
	expr.getKind() = 8 // = only object.
}

predicate isArray(Expr expr) {
	expr.getKind() = 7 // = array.
}

bindingset[stringToTest, stringInLowerCase]
predicate isLike(string stringToTest, string stringInLowerCase) {
	stringToTest.toLowerCase().matches("%"+stringInLowerCase+"%")
}

// ==================================================================================================================================================
// --------------------------------------------------------------------- Import ---------------------------------------------------------------------
// ==================================================================================================================================================

bindingset[importName]
predicate isImport(Expr expr, string importName) {
	exists(Import i | i = expr.(Import) and i.getImportedPath().getValue().toLowerCase().matches("%"+importName+"%"))
}

bindingset[importName]
predicate hasImport(Expr expr, string importName) {
	exists(Import i | i.getImportedPath().getValue().toLowerCase().matches("%"+importName+"%") and expr.getFile() = i.getFile())
}

bindingset[importName]
predicate isReceiverLinkedToImport(Expr receiver, string importName) {
	exists(VariableDeclarator vd | isImport(vd.getInit(), importName) and vd.getBindingPattern().getAVariable().getName() = receiver.(Expression).toStringExpression())
}

string toStringImport(Import i) {
	result = i.getImportedPath().getValue()
}

// ==================================================================================================================================================
// ------------------------------------------------------------------- Any : Any --------------------------------------------------------------------
// ==================================================================================================================================================

// ---------------------------------------------------------------- Any : Any : File ----------------------------------------------------------------

class AnyAnyFile extends File {

	AnyAnyFile() {
        this instanceof File
    }

	string toStringAnyAnyFile() {
		result = " ;; ;; ;;OTHER"
	}
}

// ---------------------------------------------------------------- Any : Any : Call ----------------------------------------------------------------

class AnyAnyCall extends CallExpr {

	AnyAnyCall() {
        this instanceof CallExpr
    }

	string toStringAnyAnyCall() {
		if this.getNumArgument() > 0 and this.getArgument(0) instanceof Expression
		then result = this.getCalleeName() + ";;" + this.toStringAnyAnyCallSample() + ";; ;;" + toStringOperationType(this)
		else result = this.getCalleeName() + ";; ;; ;;" + toStringOperationType(this)
	}

	string toStringAnyAnyCallSample() {
		result = this.getArgument(0).(Expression).toStringExpression()
	}
}

// ---------------------------------------------------------- Any : Any : File : Score --------------------------------------------------------------

string computeAnyAnyFileScoreIsAnyAnyFile(File file) { // A01
	if file instanceof AnyAnyFile
	then result = "A1"
	else result = ""
}

// ---------------------------------------------------------- Any : Any : Call : Score --------------------------------------------------------------

string computeAnyAnyCallScoreIsAnyAnyCall(CallExpr expr) { // A01
	if expr instanceof AnyAnyCall
	then result = "A1"
	else result = ""
}

// ==================================================================================================================================================
// ----------------------------------------------------------------- API : Express ------------------------------------------------------------------
// ==================================================================================================================================================

// -------------------------------------------------------------- API : Express : Call --------------------------------------------------------------

class ApiExpressCall extends CallExpr {

	ApiExpressCall() {
        this.getCalleeName() in [
			"get",
			"post",
			"put",
			"delete",
			"patch",
			"all",
			"head",
			"del"
		]
    }

	string toStringApiExpressCall() {
		if this.getNumArgument() > 0 and this.getArgument(0) instanceof Expression
		then result = this.getCalleeName() + ";;" + this.toStringApiExpressCallSample() + ";;" + this.toStringApiExpressCallTokens() + ";;" + toStringOperationType(this)
		else result = this.getCalleeName() + ";; ;; ;;" + toStringOperationType(this)
	}

	string toStringApiExpressCallSample() {
		result = this.getArgument(0).(Expression).toStringExpression()
	}

	string toStringApiExpressCallTokens() {
		if this.getNumArgument() > 0 and isApiExpressRoute(this.getArgument(0))
		then result = this.toStringApiExpressCallSample()
			.regexpReplaceAll("([^/a-zA-Z0-9_-][^/]*)", " ") // Exclusion (replacement by blank space) of any group of characters other than a literal route definition.
			.regexpReplaceAll("/", " ") // Exclusion (replacement by blank space) of special characters.
			.regexpReplaceAll("( )+", " ") // Exclusion (replacement by blank space) of extra blank spaces.
		else result = ""
	}
}

predicate isLinkedToApiExpressCall(AstNode node) {
	node instanceof ApiExpressCall and isApiExpressRoute(node.(ApiExpressCall).getArgument(0)) // Base case.
	or isLinkedToApiExpressCall(node.getParent()) // Recursive case.
}

predicate isApiExpressRoute(Expr expr) {
	expr.(Expression).toStringExpression().regexpMatch("(.)*'/(([a-zA-Z0-9_-]|[:/=?\\*])*)'(.)*")
}

// ----------------------------------------------------------- Api : Express : Assignation ----------------------------------------------------------

class ApiExpressAssignation extends Expr {

	ApiExpressAssignation() {
		(this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCalleeName() = "express"
			and this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 0)
		or
		(this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCalleeName() = "express"
			and this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 0)
    }

	string getLeft() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getLhs().(Expression).toStringExpression()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getBindingPattern().getAVariable()+"")
	}

	string getRight() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getRhs().(CallExpr).getCalleeName()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getInit()+"")
	}

	string toStringApiExpressAssignation() {
		result = this.getLeft() + " = " + this.getRight()
	}
}

predicate hasApiExpressAssignation(Expr expr) {
	exists(ApiExpressAssignation apiExpressAssignation | apiExpressAssignation.getFile() = expr.getFile())
}

predicate isReceiverLinkedToApiExpressAssignation(Expr receiver) {
	exists(ApiExpressAssignation apiExpressAssignation | receiver.(Expression).toStringExpression() = apiExpressAssignation.getLeft() and receiver.getFile() = apiExpressAssignation.getFile())
}

// ---------------------------------------------------------- Api : Express : Call : Score ----------------------------------------------------------

string computeApiExpressCallScoreIsApiExpressCall(CallExpr expr) { // E01
	if expr instanceof ApiExpressCall
	then result = "E1"
	else result = ""
}

string computeApiExpressCallScoreIsApiExpressCallStringFirstArgument(CallExpr expr) { // E02
	if isString(expr.(ApiExpressCall).getArgument(0))
	then result = "E2"
	else result = ""
}

string computeApiExpressCallScoreIsApiExpressCallStringFirstArgumentApiRouteLike(CallExpr expr) { // E03
	if isApiExpressRoute(expr.(ApiExpressCall).getArgument(0))
	then result = "E3"
	else result = ""
}

string computeApiExpressCallScoreIsApiExpressCallFunctionSecondArgument(CallExpr expr) { // E04
	if isFunction(expr.(ApiExpressCall).getArgument(1))
	then result = "E4"
	else result = ""
}

string computeApiExpressCallScoreHasApiLikeReceiverName(CallExpr expr) { // E05
	if isLike(expr.(CallExpr).getReceiver().toString(), "app") // "app" is defined as the conventional receiver in the doc (https://expressjs.com/fr/4x/api.html).
	then result = "E5"
	else result = ""
}

string computeApiExpressCallScoreHasImportApi(CallExpr expr) { // E06
	if hasImport(expr, "express") or hasImport(expr, "body-parser")
	then result = "E6"
	else result = ""
}

string computeApiExpressCallScoreHasApiExpressAssignation(CallExpr expr) { // E07
	if hasApiExpressAssignation(expr)
	then result = "E7"
	else result = ""
}

string computeApiExpressCallScoreIsReceiverLinkedToApiExpressAssignation(CallExpr expr) { // E08
	if isReceiverLinkedToApiExpressAssignation(expr.getReceiver())
	then result = "E8"
	else result = ""
}

// ==================================================================================================================================================
// ------------------------------------------------------------------- Db : Redis -------------------------------------------------------------------
// ==================================================================================================================================================

// ---------------------------------------------------------------- Db : Redis : Call ---------------------------------------------------------------

class DbRedisCall extends CallExpr {
	DbRedisCall() {
		this.getCalleeName() in [
			"get",
			"set",
			"del",
			"keys",
			"smembers",
			"srem",
			"scanStream",
			"scan",
			"mget",
			"rpush",
			"blpop",
			"lrem",
			"llen",
			"lrange",
			"multi",
			"exists",
			"setex",
			"expire",
			"flushdb",
			"lset",
			"hgetall",
			"sadd",
			"pexpire",
			"nodes",
			"hset",
			"setnx",
			"mset",
			"ltrim",
			"zrange",
			"zremrangebyrank",
			"zcard",
			"zadd",
			"zrangebyscore",
			"strlen",
			"exec",
			"publish",
			"subscribe",
			"unsubscribe",
			"eval"
		]
	}

	string toStringDbRedisCall() {
		if this.getNumArgument() > 0 and this.getArgument(0) instanceof Expression
		then result = this.getCalleeName() + ";;" + this.toStringDbRedisCallSample() + ";;" + this.toStringDbRedisCallTokens() + ";;" + toStringOperationType(this)
		else result = this.getCalleeName() + ";; ;; ;;" + toStringOperationType(this)
	}

	string toStringDbRedisCallSample() {
		result = this.getArgument(0).(Expression).toStringExpression()
	}

	string toStringDbRedisCallTokens() {
		if this.getNumArgument() > 0 and this.toStringDbRedisCallSample().regexpMatch("^(`?)(')([a-zA-Z0-9:_-]*)(')(`?)(.*)") // Match a Redis key format.
		then result = this.toStringDbRedisCallSample()
			.regexpReplaceAll("`", " ") // Exclusion of "`" coming from potential template expressions.
			.regexpReplaceAll("[^'a-zA-Z0-9:_-][^']*", " ") // Exclusion (replacement by blank space) of any group of characters other than a Redis key definition.
			.regexpReplaceAll("'", " ")
			.regexpReplaceAll("( )+", " ") // Exclusion (replacement by blank space) of extra blank spaces.
		else result = ""
	}
}

// ------------------------------------------------------------ Db : Redis : Assignation ------------------------------------------------------------

class DbRedisAssignation extends Expr {

	DbRedisAssignation() {
		(this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCalleeName() = "createClient"
			and this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 1)
		or
		(this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCalleeName() = "createClient"
			and this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 1)
    }

	string getLeft() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getLhs().(Expression).toStringExpression()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getBindingPattern().getAVariable()+"")
	}

	string getRight() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getRhs().(CallExpr).getCalleeName()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getInit()+"")
	}

	string toStringDbRedisClientAssignation() {
		result = this.getLeft() + " = " + this.getRight()
	}
}

predicate hasDbRedisClientAssignation(Expr expr) {
	exists(DbRedisAssignation dbRedisAssignation | dbRedisAssignation.getFile() = expr.getFile())
}

predicate isReceiverLinkedToRedisClientDbAssignation(Expr receiver) {
	exists(DbRedisAssignation dbRedisAssignation | receiver.(Expression).toStringExpression() = dbRedisAssignation.getLeft() and receiver.getFile() = dbRedisAssignation.getFile())
}

// ----------------------------------------------------------- Db : Redis : Call : Score ------------------------------------------------------------

string computeDbRedisCallScoreIsRedisCall(CallExpr expr) { // R01
	if expr instanceof DbRedisCall
	then result = "R1"
	else result = ""
}

string computeDbRedisCallScoreIsRedisCallWithStringFirstArgument(CallExpr expr) { // R02
	if expr instanceof DbRedisCall
	and isString(expr.(DbRedisCall).getArgument(0))
	and not isApiExpressRoute(expr.(DbRedisCall).getArgument(0))
	then result = "R2"
	else result = ""
}

string computeDbRedisCallScoreHasRedisLikeReceiverName(CallExpr expr) { // R03
	if isLike(expr.getReceiver().(Expression).toStringExpression(), "client")
	then result = "R3"
	else result = ""
}

string computeDbRedisCallScoreHasImport(CallExpr expr) { // R04
	if hasImport(expr, "redis")
	then result = "R4"
	else result = ""
}

string computeDbRedisCallScoreHasRedisClientAssignation(CallExpr expr) { // R05
	if hasDbRedisClientAssignation(expr)
	then result = "R5"
	else result = ""
}

string computeDbRedisCallScoreIsReceiverLinkedToRedisClientAssignation(CallExpr expr) { // R06
	if isReceiverLinkedToRedisClientDbAssignation(expr.getReceiver())
	then result = "R6"
	else result = ""
}

// ==================================================================================================================================================
// ------------------------------------------------------------------- Db : Mongo -------------------------------------------------------------------
// ==================================================================================================================================================

// ---------------------------------------------------------------- Db : Mongo : Call ---------------------------------------------------------------

class DbMongoCall extends CallExpr {
	DbMongoCall() {
		this.getCalleeName() in [
			"collection",
			"aggregate",
			"bulkWrite",
			"count",
			"countDocuments",
			"createIndex",
			"createIndexes",
			"deleteMany",
			"deleteOne",
			"distinct",
			"drop",
			"dropAllIndexes",
			"dropIndex",
			"dropIndexes",
			"ensureIndex",
			"estimatedDocumentCount",
			"find",
			"findAndModify",
			"findAndRemove",
			"findOne",
			"findOneAndDelete",
			"findOneAndReplace",
			"findOneAndUpdate",
			"geoHaystackSearch",
			"group",
			"indexes",
			"indexExists",
			"indexInformation",
			"initializeOrderedBulkOp",
			"initializeUnorderedBulkOp",
			"insert",
			"insertMany",
			"insertOne",
			"isCapped",
			"listIndexes",
			"mapReduce",
			"options",
			"parallelCollectionScan",
			"reIndex",
			"remove",
			"rename",
			"replaceOne",
			"save",
			"stats",
			"update",
			"updateMany",
			"updateOne",
			"watch"
		]
	}

	string toStringDbMongoCall() {
		if this.getNumArgument() > 0 and this.getArgument(0) instanceof Expression
		then result = this.getCallee().(Expression).toStringExpression() + ";;" + this.toStringDbMongoCallSample() + ";;" + this.toStringDbMongoCallTokens() + ";;" + toStringOperationType(this)
		else result = this.getCallee().(Expression).toStringExpression() + ";;" + ";;" + this.toStringDbMongoCallTokens() + ";;" + toStringOperationType(this)
	}

	string toStringDbMongoCallSample() {
		result = this.getArgument(0).(Expression).toStringExpression()
	}

	string toStringDbMongoCallTokens() {
		if this.getCallee() instanceof DotExpr and this.getCallee().getChildExpr(0).getChildExpr(1).getKind() = 0
		then result = this.getCallee().getChildExpr(0).getChildExpr(1).(Expression).toStringExpression() + ""
		else if this.getCalleeName() in ["collection"] and this.getArgument(0).(Expression).toStringExpression().regexpMatch("'[a-zA-Z0-9]*'")
		then result = this.getArgument(0).(Expression).toStringExpression().regexpReplaceAll("'", "")
		else result = ""
	}
}

// ------------------------------------------------------------ Db : Mongo : Assignation ------------------------------------------------------------

class DbMongoAssignation extends Expr {

	DbMongoAssignation() {
		(
			this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCallee().toString() = "MongoClient.connect"
			and
			(
				this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 1
				or this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 2
			)
		)
		or
		(
			this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCallee().toString() = "MongoClient.connect"
			and
			(
				this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 1
				or this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 2
			)
		)
		or
		(
			this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCalleeName() = "db"
			and
			(
				(
					this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 1
					and isString(this.(VariableDeclarator).getInit().(CallExpr).getArgument(0))
				)
				or
				this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 0
			)
		)
		or
		(
			this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCalleeName() = "db"
			and
			(
				(
					this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 1
					and isString(this.(AssignExpr).getRhs().(CallExpr).getArgument(0))
				)
				or
				this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 0
			)
		)
    }

	string getLeft() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getLhs().(Expression).toStringExpression()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getBindingPattern().getAVariable()+"")
	}

	string getRight() {
		(this instanceof AssignExpr and result = this.(AssignExpr).getRhs().(CallExpr).getCalleeName()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getInit()+"")
	}

	string toStringDbMongoClientAssignation() {
		result = this.getLeft() + " = " + this.getRight()
	}
}

predicate hasDbMongoClientAssignation(Expr expr) {
	exists(DbMongoAssignation dbMongoAssignation | dbMongoAssignation.getFile() = expr.getFile())
}

predicate isReceiverLinkedToMongoClientDbAssignation(Expr receiver) {
	exists(DbMongoAssignation dbMongoAssignation | receiver.(Expression).toStringExpression() = dbMongoAssignation.getLeft() and receiver.getFile() = dbMongoAssignation.getFile())
}

// ----------------------------------------------------------- Db : Mongo : Call : Score ------------------------------------------------------------

string computeDbMongoCallScoreIsMongoCall(CallExpr expr) { // M01
	if expr instanceof DbMongoCall
	then result = "M1"
	else result = ""
}

string computeDbMongoCallScoreIsMongoCallWithObjectOrOrArrayStringFirstArgument(CallExpr expr) { // M02
	if expr instanceof DbMongoCall
	and (isObject(expr.(DbMongoCall).getArgument(0)) or isArray(expr.(DbMongoCall).getArgument(0)) or isString(expr.(DbMongoCall).getArgument(0)))
	then result = "M2"
	else result = ""
}

string computeDbMongoCallScoreHasMongoLikeReceiverName(CallExpr expr) { // M03
	if isLike(expr.getReceiver().(Expression).toStringExpression(), "db") or isLike(expr.getReceiver().(Expression).toStringExpression(), "collection")
	then result = "M3"
	else result = ""
}

string computeDbMongoCallScoreHasImport(CallExpr expr) { // M04
	if hasImport(expr, "mongo")
	then result = "M4"
	else result = ""
}

string computeDbMongoCallScoreHasMongoClientAssignation(CallExpr expr) { // M05
	if hasDbMongoClientAssignation(expr)
	then result = "M5"
	else result = ""
}

string computeDbMongoCallScoreIsReceiverLinkedToMongoClientAssignation(CallExpr expr) { // M06
	if isReceiverLinkedToMongoClientDbAssignation(expr.getReceiver())
	then result = "M6"
	else result = ""
}