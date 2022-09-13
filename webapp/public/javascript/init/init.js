(function() {
    var lastTest = localStorage.getItem('lastTest');

    if (!lastTest) {
        localStorage.setItem('lastTest', 'intro');
        lastTest = 'intro';
    }

    function loadStyles() {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                var response = JSON.parse(this.responseText);

                response.forEach(function(link) {
                    var childLink = document.createElement('link');

                    childLink.href = link;
                    childLink.rel = 'stylesheet';

                    document.getElementsByTagName('head')[0].appendChild(childLink);
                });

                document.getElementById('root').style.display = 'block';

                resolve();
            }
            xhttp.open('GET', '/styles/list', true);
            xhttp.send();
        });
    }

    function loadScripts() {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                var response = JSON.parse(this.responseText);

                response.forEach(function(link) {
                    var childLink = document.createElement('script');

                    childLink.id = link.replace(/\.js/igm, '');
                    childLink.src = '/public/javascript/tests/' + link;
                    childLink.type = 'text/javascript';

                    document.getElementsByTagName('head')[0].appendChild(childLink);

                    var childOption = document.createElement('option');

                    childOption.textContent = link.split('-').join(' ').replace(/\.js/, '');
                    childOption.value = childLink.id;
                    childOption.classList = 'text-capitalize';
                    childOption.selected = childLink.id == lastTest;

                    document.getElementById('test-select').appendChild(childOption);
                });

                resolve();
            }
            xhttp.open('GET', '/tests/list', true);
            xhttp.send();
        });
    }

    function fetchTest(test, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            callback(JSON.parse(this.responseText));
        };

        xhttp.open('GET', '/tests/test/' + test, true);
        xhttp.send();
    }

    function fetchAuthorInfo(callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            callback(JSON.parse(this.responseText));
        };

        xhttp.open('GET', '/public/assets/author-info.json', true);
        xhttp.send();
    }

    function fetchTest(test, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            callback(JSON.parse(this.responseText));
        };

        xhttp.open('GET', '/tests/test/' + test, true);
        xhttp.send();
    }

    function bindings() {
        testSelectBinding();
        seeJavascriptBinding();
        copyJavascriptBinding();
    }

    function testSelectBinding() {
        document.getElementById('test-select').addEventListener('change', function() {
            lastTest = this.value;
            localStorage.setItem('lastTest', lastTest);

            fetchTest(lastTest, function(data) {
                var header = capitalizeFirstLetter(lastTest).replace(/\-/igm, ' ');

                document.getElementById('header').textContent = header;
                document.getElementById('root').innerHTML = data.html;
                document.getElementById('javascript-container').innerHTML = data.jsHTML;
                document.getElementById('javascript-copy-input').value = data.js;
                window[lastTest.replace(/\-/igm, '_')].load(data);
            });
        });
    }

    function copyJavascriptBinding() {
        document.getElementById('copy-javascript').addEventListener('click', function() {
            copy(document.getElementById('javascript-copy-input'));
            document.getElementById('copy-javascript').innerHTML = '<i class="text-success gg-check"></i>';

            setTimeout(function() {
                document.getElementById('copy-javascript').innerHTML = '<i class="gg-copy"></i>';
            }, 2000);
        });
    }

    function seeJavascriptBinding() {
        document.getElementById('see-javascript').addEventListener('click', function() {
            if (this.textContent == 'See JavaScript') {
                document.getElementById('javascript-container').style = '';
                document.getElementById('copy-javascript').style = '';
                this.textContent = 'Hide JavaScript';
            } else {
                document.getElementById('javascript-container').style = 'display: none;';
                document.getElementById('copy-javascript').style = 'display: none;';
                this.textContent = 'See JavaScript';
            }
        });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function copy(input) {
        navigator.clipboard.writeText(input.value);
    }

    /*
        Fetch Author information and make it accessible through the window
    */
    fetchAuthorInfo(function(author) {
        window.author = author;

        /*
            Sample of dynamic DOM head loading
        */
        Promise.all([loadStyles(), loadScripts()]).then(function() {
            var script = document.getElementById(lastTest),
                header = capitalizeFirstLetter(lastTest).replace(/\-/igm, ' ');

            /*
                Dynamic Script Loading
            */
            script.addEventListener('load', function() {
                fetchTest(lastTest, function(data) {
                    document.getElementById('header').textContent = header;
                    document.getElementById('root').innerHTML = data.html;
                    document.getElementById('javascript-container').innerHTML = data.jsHTML;
                    document.getElementById('javascript-copy-input').value = data.js;
                    bindings();

                    window[lastTest.replace(/\-/igm, '_')].load(data);
                });
            });
        });
    });
})();