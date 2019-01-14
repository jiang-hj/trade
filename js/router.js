(function() {
    window.onhashchange = function() {
        let location = window.location;
        let hash = location.hash;
        // let page = ['page_detail','page_profile'];

        let name;
        let temp = hash.match(/^#page=(\w+)/);
        if(temp) {
            name = temp[1];
        }
        
        if(name in router) {
            router[name]();
        }
    }

    window.onload = function() {
        let location = window.location;
        let hash = location.hash;
        // let page = ['page_detail','page_profile'];

        let name;
        let temp = hash.match(/^#page=(\w+)/);
        if(temp) {
            name = temp[1];
        }
        
        if(name in router) {
            router[name]();
        }
    }
    
    const router = {};
    router.history = function() {
        // refreshHistoryData();
        refreshProfilePage('history');
        global.appMain.className = 'show-profile';
        focusLIs(1);
    };
    
    router.editing = function() {
        // refreshEditingData();
        refreshProfilePage('editing');
        global.appMain.className = 'show-profile'; 
        focusLIs(0);
    };
    
    router.tools = function() {
        global.appMain.className = 'show-tools';
        focusLIs(2);
    };
    
    router.setting = function() {
        global.appMain.className = 'show-setting';
        focusLIs(3);
    };

    let navLis = document.getElementsByClassName('nav-li');
    function focusLIs(index) {
        for(let i = 0; i < navLis.length; i++) {
            if(i === index) {
                navLis[i].classList.add('onfocus')
            }else {
                navLis[i].classList.remove('onfocus');
            }
        }
    }
    
})()

