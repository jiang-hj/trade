let cookieFn = {
    get: function(name) {
        let reg = new RegExp('(^| )' + name + '([^;]*)(;|$)');
        let arr = document.cookie.match(reg);
        return (arr ? decodeURIComponent(arr[2]) : null);
    },

    set: function(name, value, expires, path, domain, secure) {
        let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        if(expires && !isNaN(Date.parse(expires))){
            let date = new Date(DateDate.parse(expires));
            cookie += '; expires=' + date.toUTCString();
        }
        if(path) {
            cookie += '; path=' + path;
        }
        if(domain) {
            cookie += '; domain=' + domain;
        }
        if(secure) {
            cookie += '; secure'
        }

        document.cookie = cookie;
    },

    remove: function(name, path, domain, secure) {
        let now = new Date();
        let expires = now.getFullYear + '/' + (now.getMonth() + 1) + '/' + (now.getDate() -1)
        this.set(name, '', expires, path, domain, secure);
    }
}

