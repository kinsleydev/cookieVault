// CookieVault v1.0.0
// c Kinsley / GPLv3.0
// https://github.com/kinsleydev/cookieVault

class CookieVault {
    #vault = {};
    #preserve = false;
    constructor({ contents, preserve }={}) {
        if(contents) this.#vault = contents;
        if(preserve) this.#preserve = true;
    }
    preserving() { return this.#preserve; }
    preserve() { this.#preserve = true }
    unpreserve() {
        this.#preserve = false;
        Object.keys(this.#vault).forEach(name => {
            this.#check(name);
        });
    }
    #check(name) {
        const cookie = this.#vault[name];
        if(cookie) {
            if(typeof cookie.expires == 'number') {
                if(Date.now() > cookie.expires && !this.#preserve) {
                    this.remove(name);
                }
            }
        }
    }
    replace(newContents) { this.#vault = newContents; }
    import(newContents) { this.#vault = newContents; }
    export() { return this.#vault; }
    clear() { this.#vault = { }; }
    remove(name) { delete this.#vault[name]; }
    append(name, value, { expires, domain, path }={}) {
        if(typeof expires == 'string') {
            expires = (new Date(expires)).getTime();
        } else if(typeof expires != 'number') {
            if(!(expires === null || expires === undefined)) {
                throw new TypeError('Field "expires" must be a number or string');
            }
        }
        if(typeof value != 'string')
            throw new TypeError('Value is required and must be a string');
        if(typeof path != 'string')
            path = '/';
        this.#vault[name] = { value, expires, domain, path };
    }
    read(name, { domain, path }={}) {
        this.#check(name);
        const cookie = this.#vault[name];
        if(!name) return null;
        if(typeof domain == 'string') {
            if(cookie.domain != domain) {
                if(!domain.endsWith('.' + cookie.domain)) {
                    return null;
                }
            }
        }
        if(typeof path == 'string') {
            if(!path.startsWith(cookie.path)) return null;
        }
        return cookie.value;
    }
    exists(name, { domain, path }={}) {
        const cookie = this.read(name, { domain, path }) === null ? false : true;
    }
    walk({ domain, path }={}) {
        const walked = { };
        Object.keys(this.#vault).forEach(key => {
            const cookie = this.read(key, { domain, path });
            if(cookie)
                walked[key] = cookie;
        });
        return walked;
    }
    /** * @param {string} headerValue */
    importCookieFromHttp(headerValue) {
        const sections = headerValue.split(';').map(section => section.trim());
        const assignment = sections.shift().split('=');
        const name = assignment.shift();
        if(assignment.length == 0) throw new TypeError('Invalid Set-Cookie header');
        const value = assignment.join('=');
        if(!assignment) throw new TypeError('Invalid Set-Cookie header');
        const cookie = { value };
        sections.forEach(section => {
            const assignment = section.split('=');
            const key = assignment.shift().toLowerCase();
            if(assignment.length == 0) return;
            const value = assignment.join('=');
            if(key === 'expires' && !('expires' in cookie)) {
                cookie.expires = (new Date(value)).getTime();
            } else if(key === 'max-age') {
                cookie.expires = Date.now() + (Number(value) * 1000);
            } else if(key === 'domain') {
                cookie.domain = value;
            } else if(key === 'path') {
                cookie.path = path;
            }
        });
        this.#vault[name] = cookie;
    }
    importCookiesFromHttp(headerValue) {
        headerValue.split(';').forEach(entry => {
            this.importCookieFromHttp(entry.trim());
        });
    }
    exportCookiesAsHttp({ domain, path }={}) {
        const entries = [];
        Object.keys(this.#vault).forEach(key => {
            const cookie = this.read(key, { domain, path });
            if(cookie)
                entries.push(`${key}=${cookie}`);
        });
        return entries.join('; ');
    }
}

module.exports = CookieVault;