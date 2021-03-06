import xs from 'xstream';
import { adapt } from '@cycle/run/lib/adapt';
import { fromEvent } from './fromEvent';
var BodyDOMSource = /** @class */ (function () {
    function BodyDOMSource(_name) {
        this._name = _name;
    }
    BodyDOMSource.prototype.select = function (selector) {
        // This functionality is still undefined/undecided.
        return this;
    };
    BodyDOMSource.prototype.elements = function () {
        var out = adapt(xs.of([document.body]));
        out._isCycleSource = this._name;
        return out;
    };
    BodyDOMSource.prototype.element = function () {
        var out = adapt(xs.of(document.body));
        out._isCycleSource = this._name;
        return out;
    };
    BodyDOMSource.prototype.events = function (eventType, options) {
        if (options === void 0) { options = {}; }
        var stream;
        stream = fromEvent(document.body, eventType, options.useCapture, options.preventDefault);
        var out = adapt(stream);
        out._isCycleSource = this._name;
        return out;
    };
    return BodyDOMSource;
}());
export { BodyDOMSource };
//# sourceMappingURL=BodyDOMSource.js.map