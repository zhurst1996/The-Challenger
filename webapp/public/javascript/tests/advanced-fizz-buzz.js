var advanced_fizz_buzz = {
    load: function() {
        this.bindings();

        document.getElementsByClassName('delete-set')[0].style = 'display: none;';
    },
    bindings: function() {
        this.addBinding();
        this.computeBinding();
        this.clearBinding();
        this.deleteSetBinding();
    },
    addBinding: function() {
        var $this = this;

        document.getElementById('add-rule-set-button').addEventListener('click', function() {
            $this.renderNewRuleSet($this);
        });
    },
    computeBinding: function() {
        var $this = this;

        document.getElementById('compute-button').addEventListener('click', function() {
            $this.renderOutput($this);
        });
    },
    clearBinding: function() {
        var $this = this;

        document.getElementById('clear-ouput-button').addEventListener('click', function() {
            var nodes = document.getElementsByClassName('results-list');

            for (var i = nodes.length - 1; i >= 0; i--) {
                var node = nodes[i];
                $this.deleteNode(node);
            }
        });
    },
    deleteSetBinding: function() {
        var $this = this;

        var deleteButtons = document.getElementsByClassName('delete-set');
        for (var i = 0; i <= deleteButtons.length - 1; i++) {
            var thisDeleteButton = deleteButtons[i];

            thisDeleteButton.removeEventListener('click', function() {});
            thisDeleteButton.addEventListener('click', function() {
                var parentFizzBuzzContainer = this.closest('.fizz-buzz-container');

                $this.deleteNode(parentFizzBuzzContainer);
            });
        }
    },
    deleteNode: function(node) {
        node.remove();
    },
    calculateNums: function() {
        var allFizzBuzzContainerElems = document.getElementById('all-rule-sets-container').getElementsByClassName('fizz-buzz-container'),
            elemCount = allFizzBuzzContainerElems.length - 1;

        var results = [];
        for (var i = 0; i <= elemCount; i++) {
            var thisFizzBuzzContainer = allFizzBuzzContainerElems[i],
                ruleSet = thisFizzBuzzContainer.getElementsByClassName('rule-set-count')[0].textContent,
                count = thisFizzBuzzContainer.getElementsByClassName('count')[0].value,
                rule = thisFizzBuzzContainer.getElementsByClassName('rule-select')[0].value,
                first = parseInt(thisFizzBuzzContainer.getElementsByClassName('fizz')[0].value),
                second = parseInt(thisFizzBuzzContainer.getElementsByClassName('buzz')[0].value),
                num = 1;

            var calculations = {
                elem: thisFizzBuzzContainer,
                ruleSet: ruleSet,
                rule: rule,
                first: first,
                second: second,
                count: count,
                results: []
            };

            while (num <= count) {
                switch (rule) {
                    case 'and':
                        var isDivisibleByBoth = this.isDivisibleBy(num, first) && this.isDivisibleBy(num, second);

                        calculations.results.push({
                            [num]: {
                                result: isDivisibleByBoth,
                                text: isDivisibleByBoth ? 'FizzBuzz' : false
                            }
                        });

                        break;
                    case 'or':
                        var isDivisibleByFirst = this.isDivisibleBy(num, first),
                            isDivisibleBySecond = this.isDivisibleBy(num, second);

                        var text = false;
                        if (isDivisibleByFirst) {
                            text = 'Fizz';
                        } else if (isDivisibleBySecond) {
                            text = 'Buzz';
                        }

                        if (isDivisibleByFirst && isDivisibleBySecond) {
                            text = 'Fizz or Buzz';
                        }

                        calculations.results.push({
                            [num]: {
                                result: isDivisibleByFirst || isDivisibleBySecond,
                                text: text
                            }
                        });
                        break;
                }
                num++;
            }

            results.push(calculations);
        }

        return results;
    },
    isDivisibleBy: function(first, last) {
        return (first % last) == 0;
    },
    createOutputEntry: function(entry) {
        var outputListElem = document.getElementById('fizz-buzz-output-container').getElementsByClassName('output-list')[0],
            div = document.createElement('div'),
            h6 = document.createElement('h6'),
            ul = document.createElement('ul');

        div.classList = 'results-list';
        h6.classList = 'card-subtitle';
        h6.textContent = capitalizeFirstLetter(entry.rule) + ' Rule Set ' + entry.ruleSet;

        var hasFizzBuzz = !!entry.results.filter(function(result, i) {
            var resultData = result[i + 1];
            return !!resultData.result;
        }).length;

        if (hasFizzBuzz) {
            entry.results.forEach(function(result, i) {
                var resultData = result[i + 1];
                if (!!resultData.result) {
                    var li = document.createElement('li');

                    li.textContent = [i + 1] + ' ' + resultData.text;
                    ul.appendChild(li);
                }
            });
        } else {
            var li = document.createElement('li');
            li.textContent = 'No Results';
            ul.appendChild(li);
        }

        div.appendChild(h6);
        div.appendChild(ul);
        outputListElem.appendChild(div);
    },
    renderNewRuleSet: function($this) {
        var fizzBuzzContainerElem = document.getElementById('all-rule-sets-container').getElementsByClassName('fizz-buzz-container')[0],
            fizzBuzzClone = fizzBuzzContainerElem.cloneNode(true);

        document.getElementById('all-rule-sets-container').appendChild(fizzBuzzClone);

        var allFizzBuzzContainerElems = document.getElementById('all-rule-sets-container').getElementsByClassName('fizz-buzz-container'),
            fizzBuzzLength = allFizzBuzzContainerElems.length,
            lastFizzBuzzContainerElem = allFizzBuzzContainerElems[fizzBuzzLength - 1];

        lastFizzBuzzContainerElem.getElementsByClassName('rule-set-count')[0].textContent = fizzBuzzLength;
        lastFizzBuzzContainerElem.getElementsByClassName('delete-set')[0].style = '';

        $this.deleteSetBinding();
    },
    renderOutput: function($this) {
        var results = $this.calculateNums();

        console.log(results);

        results.forEach(function(entry) {
            $this.createOutputEntry(entry);
        });
    }
};