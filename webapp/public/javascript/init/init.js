(function() {
    var lastTest = localStorage.getItem('lastTest');

    if (!lastTest) {
        localStorage.setItem('lastTest', 'intro');
        lastTest = 'intro';
    }

    function loadScripts() {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                var response = JSON.parse(this.responseText);

                response.forEach(function(link) {
                    var childOption = document.createElement('option');
                    var linkWithoutExtension = link.replace(/\.js/, '');
                    var optionText = linkWithoutExtension.capitalizeEachFirstLetters('-');

                    childOption.textContent = optionText;
                    childOption.value = linkWithoutExtension;
                    childOption.classList = 'text-capitalize';
                    childOption.selected = childOption.value == lastTest;

                    document.getElementById('test-select').appendChild(childOption);
                });

                resolve();
            }
            xhttp.open('GET', '/tests/list', true);
            xhttp.send();
        });
    }

    function fetchTest(test) {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                resolve(JSON.parse(this.responseText));
            };

            xhttp.open('GET', '/tests/test/' + test, true);
            xhttp.send();
        });
    }

    function fetchAuthorInfo(callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            callback(JSON.parse(this.responseText));
        };

        xhttp.open('GET', '/public/assets/author-info.json', true);
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
            document.getElementById('root').style = 'display: none;';
            fetchTest(lastTest).then(function(data) {
                var header = lastTest.replace(/\-/igm, ' ').capitalizeEachFirstLetters();

                document.getElementById('header').textContent = header;
                document.getElementById('root').innerHTML = data.html;
                document.getElementById('javascript-container').innerHTML = data.jsHTML;
                document.getElementById('javascript-copy-input').value = data.js;
                window[lastTest.replace(/\-/igm, '_')].load(data);
                document.getElementById('root').style = '';
            });
        });
    }

    function copyJavascriptBinding() {
        document.getElementById('copy-javascript').addEventListener('click', function() {
            copy(document.getElementById('javascript-copy-input'));
            document.getElementById('copy-javascript').innerHTML = '<i class="gg-check"></i>';

            setTimeout(function() {
                document.getElementById('copy-javascript').innerHTML = '<i class="gg-copy"></i>';
            }, 2000);
        });
    }

    function seeJavascriptBinding() {
        document.getElementById('see-javascript').addEventListener('click', function() {
            if (this.textContent == 'See JavaScript') {
                document.getElementById('javascript-container').style = '';
                document.getElementById('javascript-header').style = '';
                document.getElementById('copy-javascript').style = '';
                this.textContent = 'Hide JavaScript';
            } else {
                document.getElementById('javascript-container').style = 'display: none;';
                document.getElementById('javascript-header').style = 'display: none;';
                document.getElementById('copy-javascript').style = 'display: none;';
                this.textContent = 'See JavaScript';
            }
        });
    }

    /*
        Fetch Author information and make it accessible through the window
    */
    fetchAuthorInfo(function(author) {
        window.author = author;

        /*
            Sample of dynamic script loading
        */
        var header = lastTest.capitalizeEachFirstLetters('-');

        Promise.all([loadScripts(), fetchTest(lastTest)]).then(function(test) {
            var data = test[1];

            document.getElementById('header').textContent = header;
            document.getElementById('root').innerHTML = data.html;
            document.getElementById('javascript-container').innerHTML = data.jsHTML;
            document.getElementById('javascript-copy-input').value = data.js;
            bindings();

            window[lastTest.replace(/\-/igm, '_')].load(data);
            document.getElementById('root').style = '';
        });
    });
})();