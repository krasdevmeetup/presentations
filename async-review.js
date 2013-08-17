
// Проблема
// - вложенность кода
// - растущие отступы
// - постоянный проброс ошибок
// - работа на низком уровне
request.get(url, {encoding: null}, function (err, response, body) {
    if (err) return callback(err);
    fs.open(filename, "w", function (err, fd) {
        if (err) return callback(err);
        fs.write(fd, body, 0, body.length, null, function (err, written) {
            if (err) return callback(err);
            fs.close(fd, callback)
        });
    });
});













// Вынос кусков в функции
fs.writeFile = function (...) {
    ...
}

request.get(url, function (err, response, body) {
    if (err) return callback(err);
    fs.writeFile(filename, body, callback);
});



















// Несколько действий каскадом
async.waterfall([
    function (callback) {
        request.get(url, callback);
    },
    function (response, body, callback) {
        fs.writeFile(filename, body, callback);
    },
], callback)



















// Старое доброе частичное применение
async.waterfall([
    async.apply(request.get, url),
    function (response, body, callback) {
        fs.writeFile(filename, body, callback);
    },
], callback)





















// Иногда работает ещё лучше
async.waterfall([
    async.apply(fs.readFile, oldFilename),
    async.apply(fs.writeFile, filename)
], callback)























// Трюки на любителя
async.waterfall([
    async.apply(request.get, url),
    async.shift,
    async.apply(fs.writeFile, filename)
], callback)






















// Мастера async-fu делают так
request.get(url).pipe(fs.createWriteStream(filename));


























// Осторожные мастера делают так
request.get(url)
       .on('error', callback)
       .pipe(fs.createWriteStream(filename))
       .on('error', callback).on('end', callback);























// Прочее control flow
async.series(tasks, function (err, results) {
    ...
});

async.parallel([
    dbRequest,
    anotherDbRequest
], function (err, results) {
    var [result, anotherResult] = results; // JS Harmony
    ...
})

function getRandomFilename(dir, callback) {
    var filename;
    async.doWhilst(
        function ()    { filename = dir + getRandomName() },
        function ()    { return fs.exists(filename) },
        function (err) { callback(err, filename) }
    );
}







// Коллекции
async.map(filenames, fs.readFile, function (err, texts) {
    ...
});

async.each(filenames, fs.unlink, callback);

async.detect(filenames, fs.exists, function (firstExistant) {
    ...
});

// .filter(), .reject(), .reduce() ...
















// Всем спасибо, все молодцы
// Вопросы?























// P.S. хочешь жести - мотай дальше


// Автоматическое разруливание зависимостей
async.auto({
    get_article: function (callback) { ... },
    get_comments: function (callback) { ... },
    get_related: ['get_article', function (callback, results) {
        db.request(
            'articles where tags ~ ?',
            results.get_article.tags,
            callback
        );
    }],
    render: ['get_article', 'get_comments', 'get_related',
             function (callback, results) { ... }]
}, callback);














// Ручное управление
function cachedGet(url, callback) {
    var filename = __dirname + '/cache/' + url.replace(/\//g, '#');

    async.manual({
        start: function (next) {
            fs.exists(filename, next.decide);
        },
        decide: function (cacheExists, next) {
            if (cacheExists) next.readCache()
            else next.request();
        },
        request: function (next) {
            request(url, next.writeCache);
        },
        readCache: function (next) {
            fs.readFile(filename, 'utf-8', next.end);
        },
        writeCache: function (response, body, next) {
            fs.writeFile(filename, body, 'utf-8', function (error) {
                next.end(error, body);
            });
        }
    }, callback);
}



// Асинхронная логика
function cachedGet(url, callback) {
    var filename = __dirname + '/cache/' + url.replace(/\//g, '#');

    async.if(
        async.apply(fs.exists, filename),
        async.apply(fs.readFile, filename),
        async.apply(async.waterfall, [
            async.apply(request, url),
            function (response, body, callback) {
                fs.writeFile(filename, body, function (error) {
                    callback(error, body);
                });
            }
        ]),
        callback
    )
}










// Небольшой обман )
async.if = function (test, consequent, alternate, callback) {
    test(function (testResult) {
        testResult ? consequent(callback) : alternate(callback);
    });
};

asynс.manual = function (states, callback) {
    var next = {end: callback};
    Object.keys(states).forEach(function (state) {
        next[state] = function (error) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (error) callback(error)
            else states[state].apply(null, args.concat([next]));
        };
    });

    states.start(next);
};






















































