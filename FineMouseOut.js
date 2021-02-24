function makeMouseOutFn(elem){
    var list = traverseChildren(elem);
    return function onMouseOut(event) {
        var e = event.toElement || event.relatedTarget;
        if (!!~list.indexOf(e)) {
            return;
        }
        FG_logo_backward();
        // handle mouse event here!
};
}

function makeMouseInFn(elem){
    var list = traverseChildren(elem);
    return function onMouseIn(event) {
        var e = event.toElement || event.relatedTarget;
        if (!!~list.indexOf(e)) {
            return;
        }
        FG_logo_foward();
        // handle mouse event here!
};
}

//using closure to cache all child elements
    
                                                               
        
                                                           
//quick and dirty BFS children traversal, Im sure you could find a better one                                        
function traverseChildren(elem){
    var children = [];
    var q = [];
    q.push(elem);
    while (q.length>0)
    {
        var elem = q.pop();
        children.push(elem);
        pushAll(elem.children);
    }
        function pushAll(elemArray){
            for(let i=0;i<elemArray.length;i++)
            {
                q.push(elemArray[i]);
            }
            
        }
        return children;
}