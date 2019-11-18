(function(){
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};
    console.log(choosed);
    var speed = function(){
        return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    };
    var getKey = function(item){
        return item.key;
    };
    var createHTML = function(){
        var html = [ '<ul>' ];
        member.forEach(function(item, index){
            item.index = index;
            var key = getKey(item);
            var color = choosed[key] ? 'yellow' : 'white';
            html.push('<li><a href="#" style="color: ' + color + ';">' + `<img border="0" alt="W3Schools" src="${item.boxUrl}" width="100" height="100">` + '</a></li>');
        });
        html.push('</ul>');
        return html.join('');
    };
    var lottery = function(count){
        var list = canvas.getElementsByTagName('a');
        var color = 'yellow';
        var ret = member
            .filter(function(m, index){
                m.index = index;
                return !choosed[getKey(m)];
            })
            .map(function(m){
                return Object.assign({
                    score: Math.random()
                }, m);
            })
            .sort(function(a, b){
                return a.score - b.score;
            })
            .slice(0, count)
            .map(function(m){
                choosed[getKey(m)] = 1;
                list[m.index].style.color = color;
                return m;
            });
        localStorage.setItem('choosed', JSON.stringify(choosed));
        return ret;
    };
    var canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.getElementById('main').appendChild(canvas);
    new Vue({
        el: '#tools',
        data: {
            selected: 1,
            running: false,
            btns: [
                1
            ]
        },
        mounted () {
            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: speed(),
                dragControl: 1,
                textHeight: 20
            });
        },
        methods: {
            reset: function(){
                if(confirm('确定要重置么？所有之前的抽奖历史将被清除！')){
                    localStorage.clear();
                    location.reload(true);
                }
            },
            onClick: function(num){
                $('#result').hide();
                $('#main').removeClass('mask');
                this.selected = num;
            },
            toggle: function(){
                if(this.running){
                    TagCanvas.SetSpeed('myCanvas', speed());
                    var ret = lottery(this.selected);
                    if (ret.length === 0) {
                        $('#result').html('<div class="item"><img src="img/gameover.jpg" /></div>');
                        $('#result').show();
                        return;
                    }
                    var content;
                    ret.forEach(itm => {
                        var img = $(`<img src="img/${itm.phone}">`);
                        var text = $('<div>').text(`${itm.name}`);
                        var content = $('<div>').addClass('item').append(text).append(img);
                        $('#result').append(content);
                    });
                    $('#result').show();
                    // $('#result').show().html('<div class="item">' + ret.join('</div><div class="item">') + '</div>');
                    TagCanvas.Reload('myCanvas');
                    setTimeout(function(){
                        localStorage.setItem(new Date().toString(), JSON.stringify(ret));
                        $('#main').addClass('mask');
                    }, 300);
                } else {
                    $('#result .item').remove();
                    $('#result').hide();
                    $('#main').removeClass('mask');
                    TagCanvas.SetSpeed('myCanvas', [5, 1]);
                }
                this.running = !this.running;
            }
        }
    });
})();