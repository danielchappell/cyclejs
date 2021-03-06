"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function arrayEqual(requestNamespace, sourceNamespace) {
    for (var i = 0; i < sourceNamespace.length; i++) {
        if (requestNamespace[i] !== sourceNamespace[i]) {
            return false;
        }
    }
    return true;
}
function isolateSource(httpSource, scope) {
    if (scope === null) {
        return httpSource;
    }
    return httpSource.filter(function (request) {
        return Array.isArray(request._namespace) &&
            arrayEqual(request._namespace, httpSource._namespace.concat(scope));
    }, scope);
}
exports.isolateSource = isolateSource;
function isolateSink(request$, scope) {
    if (scope === null) {
        return request$;
    }
    return request$.map(function (req) {
        if (typeof req === 'string') {
            return { url: req, _namespace: [scope] };
        }
        req._namespace = req._namespace || [];
        req._namespace.unshift(scope);
        return req;
    });
}
exports.isolateSink = isolateSink;
//# sourceMappingURL=isolate.js.map