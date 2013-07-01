define({
    baseUrl: (
        typeof(window) !== 'undefined'?(
        	window.location.host == 'tictoe.php.poltava.ua' ? 'http://tictoe.php.poltava.ua/server/' : 'http://localhost/tictoe/server'
        ):''
    ),
    users_count: 2,
    width: 3,
    height: 3,
    to_win: 3,
    port: 10000
})