
var iter=100

function slower_animation(func, time, mul, condition)
{
    setTimeout(() => {
        if(condition)
            return
        else
        {
            func()
            time = mul(time)
            slower_animation(func, time*mul, mul, condition)
        }
    }, time);
}