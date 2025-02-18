module.exports = {
    ".js": {
        "language": [
            "require", "break", "case", "catch", "class", "const", "continue", "debugger", "default",
            "delete", "do", "else", "export", "extends", "finally", "for", "function",
            "if", "import", "in", "instanceof", "new", "return", "super", "switch",
            "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield",
            "let", "static", "await", "enum", "implements", "package", "protected", "interface", "private", "public", "true", "false", "null",
            "resolve", 'reject', "promise", "logger", "parser"
        ],
        "libraries": {
            "mongoDb": [
                "mongo", "mongoDb", "mongoClient",
                "find", "findOne", "insert", "insertOne", "insertMany", "update", "updateOne", "updateMany",
                "delete", "deleteOne", "deleteMany", "replaceOne", "count", "countDocuments", "estimatedDocumentCount",
                "$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$in", "$nin", "$or", "$and", "$not", "$nor",
                "$exists", "$type", "$expr", "$jsonSchema", "$mod", "$regex", "$text", "$where",
                "$set", "$unset", "$rename", "$inc", "$mul", "$min", "$max", "$currentDate",
                "$push", "$pop", "$pull", "$pullAll", "$addToSet", "$each", "$slice", "$sort",
                "$match", "$group", "$sort", "$limit", "$skip", "$project", "$unwind", "$lookup", "$out", "$merge",
                "createIndex", "dropIndex", "ensureIndex", "getIndexes", "$geoNear", "$geoWithin", "$near", "$nearSphere",
                "createCollection", "drop", "renameCollection", "listCollections",
                "startSession", "commitTransaction", "abortTransaction",
                "watch", "bulkWrite", "explain", "stats"
            ],
            "redis": [
                "redis", "redisClient",
                "del", "dump", "exists", "expire", "expireat", "keys", "move", "persist", "pttl", "ttl", "randomkey",
                "rename", "renamenx", "sort", "type", "append", "bitcount", "bitop", "bitpos", "decr", "decrby",
                "get", "getbit", "getrange", "getset", "incr", "incrby", "incrbyfloat", "mget", "mset", "msetnx",
                "psetex", "set", "setbit", "setex", "setnx", "setrange", "strlen", "blpop", "brpop", "brpoplpush",
                "lindex", "linsert", "llen", "lpop", "lpush", "lpushx", "lrange", "lrem", "lset", "ltrim", "rpop",
                "rpoplpush", "rpush", "rpushx", "sadd", "scard", "sdiff", "sdiffstore", "sinter", "sinterstore",
                "sismember", "smembers", "smove", "spop", "srandmember", "srem", "sunion", "sunionstore", "hdel",
                "hexists", "hget", "hgetall", "hincrby", "hincrbyfloat", "hkeys", "hlen", "hmget", "hmset", "hset",
                "hsetnx", "hvals", "zadd", "zcard", "zcount", "zincrby", "zinterstore", "zlexcount", "zrange",
                "zrangebylex", "zrangebyscore", "zrank", "zrem", "zremrangebylex", "zremrangebyrank", "zremrangebyscore",
                "zrevrange", "zrevrangebyscore", "zrevrank", "zscore", "zunionstore", "discard", "exec", "multi",
                "unwatch", "watch", "eval", "evalsha", "publish", "subscribe", "unsubscribe", "psubscribe", "punsubscribe",
                "auth", "echo", "ping", "quit", "select", "bgrewriteaof", "bgsave", "client kill", "client list",
                "client getname", "client pause", "client setname", "config get", "config rewrite", "config set",
                "dbsize", "debug object", "debug segfault", "flushall", "flushdb", "info", "lastsave", "monitor",
                "role", "save", "shutdown", "slaveof", "slowlog", "sync", "time"
            ]
        }
    },
    ".mjs": {
        "_extends_": ".js",
    },
    ".cjs": {
        "_extends_": ".js",
    },
    ".ts": {
        "_extends_": ".js",
    },
    ".jsx": {
        "_extends_": ".js",
    },
    ".tsx": {
        "_extends_": ".js",
    },
    ".java": {
        "language": [
            "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const",
            "continue", "default", "do", "double", "else", "enum", "extends", "final", "finally", "float",
            "for", "goto", "if", "implements", "import", "instanceof", "int", "string", "interface", "long", "native", "exception",
            "new", "package", "private", "protected", "public", "return", "short", "static", "strictfp",
            "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "void",
            "volatile", "while", "module", "requires", "exports", "opens", "provides", "uses", "to", "with"
        ],
        "libraries": {
            "mongo": [
                "MongoClient", "MongoClients", "MongoDatabase", "MongoCollection", "MongoCursor",
                "MongoIterable", "ClientSession", "MongoCredential", "MongoNamespace", "MongoException",
                "MongoClientSettings",
                "insertOne", "insertMany", "find", "findOne", "findOneAndUpdate",
                "findOneAndDelete", "findOneAndReplace", "updateOne", "updateMany",
                "replaceOne", "deleteOne", "deleteMany",
                "eq", "ne", "gt", "gte", "lt", "lte", "and", "or", "not", "nor",
                "exists", "type", "mod", "regex", "text", "where", "all", "elemMatch", "size",
                "aggregate", "match", "group", "project", "sort", "limit", "skip",
                "unwind", "lookup", "merge", "out",
                "createIndex", "dropIndex", "listIndexes", "ensureIndex", "getIndexes",
                "ascending", "descending", "hashed", "text",
                "startSession", "startTransaction", "commitTransaction", "abortTransaction",
                "createCollection", "drop", "renameCollection", "listCollections",
                "listDatabases", "getDatabase",
                "bulkWrite", "BulkWriteOptions", "BulkWriteResult",
                "countDocuments", "estimatedDocumentCount", "explain", "stats", "watch",
                "set", "unset", "inc", "mul", "rename", "min", "max", "currentDate",
                "push", "pop", "pull", "pullAll", "addToSet", "each", "slice", "sort"
            ],
            "redis": [
                "Jedis", "JedisPool", "JedisCluster", "Pipeline", "Transaction",
                "RedisClient", "RedisURI", "StatefulRedisConnection", "RedisCommands",
                "RedisAsyncCommands", "RedisReactiveCommands",
                "Redisson", "RedissonClient", "RMap", "RList", "RSet", "RBucket", "RLock", "RQueue",
                "set", "get", "append", "strlen", "incr", "decr", "incrBy", "decrBy", "mget", "mset", "getset",
                "lpush", "rpush", "lpop", "rpop", "lindex", "llen", "lrange", "lrem", "linsert", "ltrim",
                "sadd", "srem", "smembers", "sismember", "spop", "scard", "srandmember", "sinter", "sunion", "sdiff",
                "zadd", "zrem", "zrange", "zrevrange", "zrangeByScore", "zrank", "zrevrank", "zcard", "zcount", "zincrby",
                "hset", "hget", "hdel", "hmget", "hmset", "hgetAll", "hexists", "hkeys", "hvals", "hlen",
                "multi", "exec", "discard", "watch", "unwatch", "pipeline", "sync", "flush",
                "del", "exists", "expire", "ttl", "persist", "rename", "move", "type", "keys", "randomKey",
                "subscribe", "unsubscribe", "psubscribe", "punsubscribe", "publish",
                "eval", "evalsha", "scriptLoad", "scriptFlush", "scriptExists", "scriptKill",
                "save", "bgsave", "bgrewriteaof", "lastsave", "restore", "dump",
                "pfadd", "pfcount", "pfmerge", "setbit", "getbit", "bitcount", "bitop",
                "geoadd", "geodist", "geohash", "geopos", "georadius",
                "getAsync", "setAsync", "deleteAsync", "subscribeAsync", "publishAsync", "addListener", "thenAccept", "thenApply"
            ]
        }
    }
}