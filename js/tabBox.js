(function() {
    let tabBoxes = document.getElementsByClassName('tab-box');

    for(let i = 0; i < tabBoxes.length; i++) {
        addAcition(tabBoxes[i]);
    }

    function addAcition(tabBox) {
        let head = tabBox.getElementsByClassName('tab-head')[0],
            tags = tabBox.getElementsByClassName('tab-tag'),
            contents = tabBox.getElementsByClassName('tab-content');
        
        head.addEventListener('click',function(e) {
            let tag = global.getClosest('.tab-tag', e.target);
            if(tag) {
                let index;
                for(let i = 0; i < tags.length; i++) {
                    if(tag === tags[i]) {
                        tags[i].classList.add('actived');
                        index = i;
                    }else {
                        tags[i].classList.remove('actived');
                    }
                }

                for(let i = 0; i < contents.length; i++) {
                    contents[i].classList.remove('actived');
                }

                contents[index].classList.add('actived');

            }
        },false)
    }

})();