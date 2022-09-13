var intro = {
    load: function(response) {
        this.renderIntro();
        this.bindings();
    },

    bindings: function() {
        this.sortByBinding();
        this.toggleTechSectionBinding();
    },

    toggleTechSectionBinding: function() {
        document.getElementsByClassName('toggle-tech-section')[0].addEventListener('click', function() {
            var isShowing = document.getElementsByClassName('toggle-tech-section')[0].textContent == 'Hide';

            if (isShowing) {
                document.getElementsByClassName('toggle-tech-section')[0].textContent = 'See More';
                document.getElementById('techinical-info').style = 'display: none;';
            } else {
                document.getElementsByClassName('toggle-tech-section')[0].textContent = 'Hide';
                document.getElementById('techinical-info').style = '';
            }
        });
    },

    sortByBinding: function() {
        var $this = this;
        document.getElementById('techinical-info').getElementsByClassName('sort-by-technology')[0].addEventListener('change', function() {
            var renderData = structuredClone($this.data);

            document.getElementById('techinical-info').getElementsByClassName('technology-table')[0].getElementsByTagName('tbody')[0].innerHTML = '';

            renderData.data = $this.groupTechnologySet(renderData.data, renderData.numberOfColumns, [], parseInt(this.value));
            $this.createTechnologyDataEntries(renderData.data, renderData.numberOfColumns, renderData.numberOfRows);
        });
    },

    fetchTechnologies: function() {
        return new Promise(function(resolve, reject) {
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                var response = JSON.parse(this.responseText);

                resolve(response);
            }
            xhttp.open('GET', '/data/technologies/list', true);
            xhttp.send();
        });
    },

    findDateRangeByYear: function(start, end) {
        var startDate = new Date(start),
            endDate = new Date(end);

        var diffTime = Math.abs(startDate - endDate);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return (diffDays / 365);
    },

    getAuthorAge: function() {
        var exactAge = this.findDateRangeByYear(new Date(), window.author.dob),
            approxAge = Math.round(this.findDateRangeByYear(new Date(), window.author.dob));

        return {
            exactAge: exactAge,
            approxAge: approxAge
        };
    },

    getAuthorWorkTime: function() {
        return Math.round(this.findDateRangeByYear(new Date(), window.author.startWorkDate));
    },

    /*
        Example of a recursive function, this is completely unnecessary to do
        however I am showing the extent of my knowledge of concatinating arrays,
        manipulating data, and creating a recursive function without Big O.
    */
    groupTechnologySet: function(data, numberOfColumns, initialDataSet, grouping) {
        var thisDataSet = [];

        for (var i = 0; i < numberOfColumns; i++) {
            var thisData = data[0];

            thisDataSet.push(thisData);

            data.splice(0, 1);
        }

        initialDataSet.push(thisDataSet);

        if (!!data.length) {
            return this.groupTechnologySet(data, numberOfColumns, initialDataSet, grouping);
        } else {
            var returnedSet = [];

            initialDataSet.sort((function(index) {
                return function(a, b) {
                    return (a[index].data.toLocaleLowerCase() === b[index].data.toLocaleLowerCase() ? 0 : (a[index].data.toLocaleLowerCase() < b[index].data.toLocaleLowerCase() ? -1 : 1));
                };
            })(grouping - 1));

            initialDataSet.forEach(function(dataSet) {
                returnedSet = returnedSet.concat(dataSet);
            });

            return returnedSet;
        }
    },

    createTechnologyHeaders: function(headers) {
        headers.forEach(function(header) {
            var option = document.createElement('option');
            option.textContent = header.data;
            option.value = header.column;

            var th = document.createElement('th');
            th.textContent = header.data;
            th.scope = 'col';

            document.getElementById('techinical-info').getElementsByClassName('sort-by-technology')[0].appendChild(option);
            document.getElementById('techinical-info').getElementsByClassName('technology-table')[0].getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].appendChild(th);
        });
    },

    createTechnologyDataEntries: function(data, numberOfColumns, numberOfRows) {
        for (var i = 0; i < numberOfRows; i++) {
            var tr = document.createElement('tr');

            for (var num = 0; num < numberOfColumns; num++) {
                var dataSet = data[0];
                var td = document.createElement('td');

                td.textContent = dataSet.data;
                tr.appendChild(td);

                data.splice(0, 1);
            }

            document.getElementById('techinical-info').getElementsByClassName('technology-table')[0].getElementsByTagName('tbody')[0].appendChild(tr);
        }
    },

    renderTechnology: function(data) {
        this.createTechnologyHeaders(data.headers);
        this.createTechnologyDataEntries(data.data, data.numberOfColumns, data.numberOfRows);
    },

    renderIntro: function() {
        var $this = this;
        this.fetchTechnologies().then(function(data) {
            var renderData = structuredClone(data),
                moduleData = structuredClone(data);

            $this.data = moduleData;
            renderData.data = $this.groupTechnologySet(renderData.data, renderData.numberOfColumns, [], 1);

            $this.renderTechnology(renderData);
        });

        var ages = this.getAuthorAge(),
            workTime = this.getAuthorWorkTime();

        var intro = document.getElementById('html-intro');

        intro.getElementsByClassName('author-name')[0].textContent = window.author.first + ' ' + window.author.last;
        intro.getElementsByClassName('exact-author-age')[0].textContent = ages.exactAge;
        intro.getElementsByClassName('approx-author-age')[0].textContent = ages.approxAge;
        intro.getElementsByClassName('author-work-time')[0].textContent = workTime;
        intro.getElementsByClassName('author-title')[0].textContent = window.author.title;
        intro.getElementsByClassName('author-primary-language')[0].textContent = window.author.primaryLanguage;
        intro.getElementsByClassName('author-resume')[0].href = window.author.resume;
    }
};