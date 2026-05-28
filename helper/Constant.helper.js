// Libraries

const dotenv = require('dotenv')

/**
 * @overview Represents the helper constants.
 */

// Configuration

dotenv.config()

// Constants : AST

const TEMP_FOLDER_NAME = 'TEMP'
const CODEQL_FOLDER_NAME_SUFFIX = '-codeql'
const CODEQL_QUERY_FOLDER_NAME = 'query'
const CODEQL_RESULT_FOLDER_NAME = 'result'
const CODEQL_RESULT_FILE_NAME = 'result.csv'

// Constants : NLP & TR

const LANGUAGES = ['javascript']
const LANGUAGES_KEYWORDS = {
  js: {
    language: [
      'javascript',
      'typescript',

      // Keywords

      'await',
      'break',
      'case',
      'catch',
      'class',
      'const',
      'continue',
      'debugger',
      'default',
      'delete',
      'do',
      'else',
      'export',
      'extends',
      'finally',
      'for',
      'function',
      'if',
      'import',
      'in',
      'instanceof',
      'let',
      'new',
      'return',
      'super',
      'switch',
      'this',
      'throw',
      'try',
      'typeof',
      'var',
      'void',
      'while',
      'with',
      'yield',
      'static',
      'async',
      'sync',
      'enum',
      'implements',
      'interface',
      'package',
      'private',
      'protected',
      'public',

      // Literals

      'true',
      'false',
      'null',
      'undefined',
      'NaN',
      'Infinity',

      // Functions

      'eval',
      'isFinite',
      'isNaN',
      'parseFloat',
      'parseInt',
      'decodeURI',
      'decodeURIComponent',
      'encodeURI',
      'encodeURIComponent',

      // Objects

      'Object',
      'Function',
      'Boolean',
      'Symbol',
      'Error',
      'AggregateError',
      'EvalError',
      'RangeError',
      'ReferenceError',
      'SyntaxError',
      'TypeError',
      'URIError',
      'Number',
      'BigInt',
      'Math',
      'Date',
      'String',
      'RegExp',
      'Array',
      'Int8Array',
      'Uint8Array',
      'Uint8ClampedArray',
      'Int16Array',
      'Uint16Array',
      'Int32Array',
      'Uint32Array',
      'Float32Array',
      'Float64Array',
      'BigInt64Array',
      'BigUint64Array',
      'Map',
      'Set',
      'WeakMap',
      'WeakSet',
      'ArrayBuffer',
      'SharedArrayBuffer',
      'DataView',
      'JSON',
      'Promise',
      'Generator',
      'GeneratorFunction',
      'AsyncFunction',
      'AsyncGenerator',
      'AsyncGeneratorFunction',
      'Reflect',
      'Proxy',
      'Atomics',
      'Intl',

      // Object

      'assign',
      'create',
      'defineProperties',
      'defineProperty',
      'entries',
      'freeze',
      'fromEntries',
      'getOwnPropertyDescriptor',
      'getOwnPropertyDescriptors',
      'getOwnPropertyNames',
      'getOwnPropertySymbols',
      'getPrototypeOf',
      'hasOwn',
      'is',
      'isExtensible',
      'isFrozen',
      'isSealed',
      'keys',
      'preventExtensions',
      'seal',
      'setPrototypeOf',
      'values',

      // Function / Class

      'apply',
      'bind',
      'call',
      'toString',
      'constructor',
      'length',

      // Array

      'at',
      'concat',
      'copyWithin',
      'entries',
      'every',
      'fill',
      'filter',
      'find',
      'findIndex',
      'findLast',
      'findLastIndex',
      'flat',
      'flatMap',
      'forEach',
      'from',
      'includes',
      'indexOf',
      'isArray',
      'join',
      'keys',
      'lastIndexOf',
      'map',
      'of',
      'pop',
      'push',
      'reduce',
      'reduceRight',
      'reverse',
      'shift',
      'slice',
      'some',
      'sort',
      'splice',
      'toLocaleString',
      'toString',
      'unshift',
      'values',
      'length',

      // String

      'charAt',
      'charCodeAt',
      'codePointAt',
      'concat',
      'endsWith',
      'includes',
      'indexOf',
      'lastIndexOf',
      'localeCompare',
      'match',
      'matchAll',
      'normalize',
      'padEnd',
      'padStart',
      'repeat',
      'replace',
      'replaceAll',
      'search',
      'slice',
      'split',
      'startsWith',
      'substring',
      'toLowerCase',
      'toUpperCase',
      'trim',
      'trimEnd',
      'trimStart',
      'valueOf',
      'length',
      'stringify',

      // Number / BigInt

      'EPSILON',
      'MAX_SAFE_INTEGER',
      'MIN_SAFE_INTEGER',
      'MAX_VALUE',
      'MIN_VALUE',
      'NEGATIVE_INFINITY',
      'POSITIVE_INFINITY',
      'isFinite',
      'isInteger',
      'isNaN',
      'isSafeInteger',
      'parseFloat',
      'parseInt',
      'toFixed',
      'toPrecision',
      'toString',
      'valueOf',
      'asIntN',
      'asUintN',

      // Math

      'E',
      'LN2',
      'LN10',
      'LOG2E',
      'LOG10E',
      'PI',
      'SQRT1_2',
      'SQRT2',
      'abs',
      'acos',
      'acosh',
      'asin',
      'asinh',
      'atan',
      'atan2',
      'atanh',
      'ceil',
      'floor',
      'round',
      'trunc',
      'max',
      'min',
      'pow',
      'random',
      'sqrt',
      'log',
      'log2',
      'log10',
      'exp',
      'sign',
      'sin',
      'cos',
      'tan',
      'hypot',
      'imul',
      'clz32',

      // Promise

      'then',
      'catch',
      'finally',
      'resolve',
      'reject',
      'all',
      'allSettled',
      'any',
      'race',

      // Symbols

      'iterator',
      'asyncIterator',
      'toPrimitive',
      'toStringTag',
      'species',

      // Modules

      'require',
      'module',
      'exports',
      'console',
      'log',

      // Misc

      'promise',
      'parser',
      'logger',
      'err',
      'error'
    ], // Source: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Lexical_grammar, https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference, https://ecma-international.org/publications-and-standards/standards/ecma-262/
    libraries: {
      dotenv: ['dotenv', 'env', 'process'] // Source: https://www.dotenv.org/docs/
    }
    // Example on how to include more reserved keywords.
    // "libraries": {
    //     "mongoDb": [
    //         "find", "findOne", "insert", "insertOne", "insertMany", "update", "updateOne", "updateMany" // , ...  // Source: TODO
    //     ],
    //     "redis": [
    //         "redis", "redisClient", "del", "dump", "exists", "expire", "expireat", "keys" // , ... // Source: TODO
    //     ]
    // }
  },
  mjs: {
    _extends_: 'js'
  },
  cjs: {
    _extends_: 'js'
  },
  ts: {
    _extends_: 'js'
  },
  jsx: {
    _extends_: 'js'
  },
  tsx: {
    _extends_: 'js'
  },
  java: {
    language: [
      'java',

      // Keywords
      'abstract',
      'assert',
      'boolean',
      'break',
      'byte',
      'case',
      'catch',
      'char',
      'class',
      'const',
      'continue',
      'default',
      'do',
      'double',
      'else',
      'enum',
      'extends',
      'final',
      'finally',
      'float',
      'for',
      'goto',
      'if',
      'implements',
      'import',
      'instanceof',
      'int',
      'interface',
      'long',
      'native',
      'new',
      'package',
      'private',
      'protected',
      'public',
      'return',
      'short',
      'static',
      'strictfp',
      'super',
      'switch',
      'synchronized',
      'this',
      'throw',
      'throws',
      'transient',
      'try',
      'void',
      'volatile',
      'while',

      // Literals
      'true',
      'false',
      'null',

      // Primitive types
      'boolean',
      'byte',
      'char',
      'short',
      'int',
      'long',
      'float',
      'double',

      // Common classes
      'Object',
      'Class',
      'String',
      'StringBuilder',
      'StringBuffer',
      'Number',
      'Integer',
      'Long',
      'Double',
      'Float',
      'Short',
      'Byte',
      'Boolean',
      'Character',
      'Math',
      'System',
      'Runtime',
      'Thread',
      'ThreadGroup',
      'Runnable',
      'Exception',
      'RuntimeException',
      'Error',
      'Throwable',
      'StackTraceElement',

      // Collections
      'Collection',
      'List',
      'ArrayList',
      'LinkedList',
      'Set',
      'HashSet',
      'TreeSet',
      'Map',
      'HashMap',
      'LinkedHashMap',
      'TreeMap',
      'Queue',
      'Deque',
      'ArrayDeque',
      'Iterator',
      'Iterable',
      'Comparator',
      'Comparable',
      'Optional',

      // Arrays
      'length',
      'clone',
      'arraycopy',

      // Math
      'abs',
      'max',
      'min',
      'round',
      'ceil',
      'floor',
      'sqrt',
      'pow',
      'random',
      'sin',
      'cos',
      'tan',
      'log',
      'log10',
      'exp',

      // Strings
      'length',
      'charAt',
      'substring',
      'indexOf',
      'lastIndexOf',
      'startsWith',
      'endsWith',
      'contains',
      'replace',
      'replaceAll',
      'replaceFirst',
      'split',
      'toLowerCase',
      'toUpperCase',
      'trim',
      'isEmpty',
      'equals',
      'equalsIgnoreCase',
      'valueOf',

      // Exceptions
      'Exception',
      'RuntimeException',
      'NullPointerException',
      'IllegalArgumentException',
      'IllegalStateException',
      'IndexOutOfBoundsException',
      'ArrayIndexOutOfBoundsException',
      'ClassCastException',
      'ArithmeticException',
      'IOException',
      'FileNotFoundException',
      'InterruptedException',

      // Annotations
      'Override',
      'Deprecated',
      'SuppressWarnings',
      'FunctionalInterface',
      'SafeVarargs',
      'Retention',
      'Target',
      'Documented',

      // Concurrency
      'synchronized',
      'volatile',
      'wait',
      'notify',
      'notifyAll',
      'sleep',
      'yield',
      'join',
      'Callable',
      'Future',
      'Executor',
      'ExecutorService',
      'Executors',
      'ForkJoinPool',
      'CompletableFuture',
      'AtomicInteger',
      'AtomicLong',

      // io
      'File',
      'InputStream',
      'OutputStream',
      'FileInputStream',
      'FileOutputStream',
      'Reader',
      'Writer',
      'BufferedReader',
      'BufferedWriter',
      'PrintStream',
      'PrintWriter',
      'Serializable',

      // nio
      'Path',
      'Paths',
      'Files',
      'ByteBuffer',
      'CharBuffer',
      'Charset',

      // Reflection
      'reflect',
      'Field',
      'Method',
      'Constructor',
      'Modifier',
      'InvocationTargetException',

      // Modules
      'module',
      'requires',
      'exports',
      'opens',
      'uses',
      'provides',
      'with',

      // Lambda
      'lambda',
      'stream',
      'Stream',
      'IntStream',
      'LongStream',
      'DoubleStream',
      'filter',
      'map',
      'flatMap',
      'reduce',
      'collect',
      'forEach',
      'peek',

      // Misc
      'main',
      'args',
      'println',
      'print',
      'printf',
      'exit',
      'gc',
      'error',

      // Util

      'util',

      // Util Function
      'Function',
      'BiFunction',
      'Consumer',
      'BiConsumer',
      'Supplier',
      'Predicate',
      'BiPredicate',
      'UnaryOperator',
      'BinaryOperator',

      // Util Stream
      'BaseStream',
      'Collector',
      'Collectors',
      'Spliterator',
      'SummaryStatistics',

      // Util Optional
      'OptionalInt',
      'OptionalLong',
      'OptionalDouble',

      // Util Time
      'Instant',
      'Duration',
      'Period',
      'LocalDate',
      'LocalTime',
      'LocalDateTime',
      'ZonedDateTime',
      'OffsetDateTime',
      'OffsetTime',
      'ZoneId',
      'ZoneOffset',
      'Clock',
      'Month',
      'DayOfWeek',
      'Year',
      'YearMonth',
      'MonthDay',
      'DateTimeFormatter',

      // Util Concurrent
      'ConcurrentMap',
      'ConcurrentHashMap',
      'BlockingQueue',
      'ArrayBlockingQueue',
      'LinkedBlockingQueue',
      'ConcurrentLinkedQueue',
      'CopyOnWriteArrayList',
      'CopyOnWriteArraySet',
      'Semaphore',
      'CountDownLatch',
      'CyclicBarrier',
      'Phaser',
      'ThreadLocal',
      'TimeUnit',
      'ScheduledExecutorService',
      'ScheduledFuture',
      'DelayQueue',
      'Exchanger',

      // Util Atomic
      'AtomicBoolean',
      'AtomicReference',
      'AtomicIntegerArray',
      'AtomicLongArray',
      'LongAdder',
      'DoubleAdder',
      'LongAccumulator',
      'DoubleAccumulator',

      // Util Regex
      'Pattern',
      'Matcher',
      'MatchResult',

      // Util Logging
      'Logger',
      'Level',
      'LogManager',
      'Handler',
      'Formatter',
      'Filter',

      // Lang Invoke
      'MethodHandle',
      'MethodHandles',
      'CallSite',
      'MutableCallSite',
      'VolatileCallSite',

      // Lang Module
      'Module',
      'ModuleLayer',
      'ModuleDescriptor',

      // io Util
      'Closeable',
      'Flushable',
      'DataInput',
      'DataOutput',
      'DataInputStream',
      'DataOutputStream',
      'ObjectInput',
      'ObjectOutput',
      'ObjectInputStream',
      'ObjectOutputStream',
      'Externalizable',

      // nio File
      'FileSystem',
      'FileSystems',
      'FileStore',
      'WatchService',
      'WatchKey',
      'WatchEvent',
      'OpenOption',
      'StandardOpenOption',
      'CopyOption',
      'LinkOption',
      'StandardCopyOption',

      // nio Channel
      'Channel',
      'ReadableByteChannel',
      'WritableByteChannel',
      'SeekableByteChannel',
      'FileChannel',
      'SocketChannel',
      'ServerSocketChannel',
      'DatagramChannel',
      'Selector',
      'SelectionKey',

      // Net
      'URI',
      'URL',
      'URLConnection',
      'HttpURLConnection',
      'InetAddress',
      'InetSocketAddress',
      'Socket',
      'ServerSocket',
      'DatagramSocket',
      'MulticastSocket',

      // Security
      'MessageDigest',
      'SecureRandom',
      'Key',
      'KeyPair',
      'KeyPairGenerator',
      'Signature',
      'Permission',
      'Permissions',
      'AccessController',
      'Policy',

      // Text
      'Format',
      'MessageFormat',
      'NumberFormat',
      'DecimalFormat',
      'DateFormat',
      'SimpleDateFormat',
      'Collator',
      'BreakIterator',

      // Util Misc
      'UUID',
      'Objects',
      'Arrays',
      'Collections',
      'ServiceLoader',
      'ResourceBundle',
      'Properties',
      'Random',
      'SplittableRandom',
      'Scanner',
      'Formatter'
    ] // Source: https://docs.oracle.com/javase/specs/, https://docs.oracle.com/en/java/javase/, https://openjdk.org/,https://docs.oracle.com/javase/tutorial/, https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html
  }
}
const LANGUAGES_COMMENTS = {
  javascript: {
    line: ['//'],
    block: [['/*', '*/']]
  },
  java: {
    line: ['//'],
    block: [['/*', '*/']]
  }
}
const LANGUAGES_STRINGS = {
  javascript: {
    string: ['"', "'", '`'],
    escape: '\\'
  },
  java: {
    string: ['"', "'", '`'],
    escape: '\\'
  }
}
const FILE_EXTENSIONS_LANGUAGES = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'javascript',
  java: 'java'
}
const STOP_WORD_EXCLUSION = ['about', 'like', 'now', 'other', 'up', 'all', 'get', 'one', 'many']
const STOP_WORD_INCLUSION = ['id']
const LEMMATIZATION_EXCLUSION = { datum: 'data' }
const NLP_METRICS_WEIGHTS = {
  // TF-IDF: Measures importance of a concept across all files (higher = more significant).
  tfidf: 1 / 4,
  // CoV: Measures the concentration of a concept across all files (higher = more unevenly distributed).
  coefficientVariation: 1 / 4,
  // Dominance: Measures how much a concept dominates in a file relative to others (higher = more dominant).
  dominance: 1 / 4,
  frequencyMean: 1 / 4 // Frequency mean: Measures the mean frequency of a concept across all files (higher = frequent on average).
} // NOTE: Those weights were defined empirically.
const TECHNOLOGY_ANY = 'any-any-any'
const UNDEFINED = '?'
const HEURISTICS_ANY = 'A0'
const TAG_GROUP_TERMS_IN = 'IN'
const TAG_GROUP_TERMS_OUT = 'OUT'
const TAG_GROUP_TERMS_UNKNOWN = '?'
const GROUP_TERMS_OUT_SEEDS_BASIS = [
  // Languages & Technologies

  'html',
  'java',
  'javascript',
  'typescript',
  'js',
  'ts',
  'mongodb',
  'mongo',
  'redis',
  'postgres',
  'maven',
  'node',
  'springboot',
  'spring',
  'react',
  'express',
  'google',
  'microsoft',
  'apple',
  'amazon',
  'openai',
  'github',
  'git',

  // Format

  'json',
  'gson',

  // Protocols

  'http',
  'ssh',
  'ftp',
  'websocket',
  'ws',
  'url',

  // Architecture

  'component',
  'module',
  'database',
  'db',
  'api',

  // Mechanisms

  'logger',
  'env',
  'config',
  'configuration',
  'auth',
  'authentication',
  'credentials',
  'cache',
  'proxy',
  'iterator',
  'callback',
  'request',
  'req',
  'response',
  'res',
  'timeout',
  'error',
  'err',
  'return',
  'null',

  'test',
  'feature',
  'spec',
  'mock'
]

module.exports = {
  TEMP_FOLDER_NAME,
  CODEQL_FOLDER_NAME_SUFFIX,
  CODEQL_QUERY_FOLDER_NAME,
  CODEQL_RESULT_FOLDER_NAME,
  CODEQL_RESULT_FILE_NAME,
  LANGUAGES,
  LANGUAGES_KEYWORDS,
  LANGUAGES_COMMENTS,
  LANGUAGES_STRINGS,
  FILE_EXTENSIONS_LANGUAGES,
  STOP_WORD_EXCLUSION,
  STOP_WORD_INCLUSION,
  LEMMATIZATION_EXCLUSION,
  NLP_METRICS_WEIGHTS,
  TECHNOLOGY_ANY,
  UNDEFINED,
  HEURISTICS_ANY,
  TAG_GROUP_TERMS_IN,
  TAG_GROUP_TERMS_OUT,
  TAG_GROUP_TERMS_UNKNOWN,
  GROUP_TERMS_OUT_SEEDS_BASIS
}
