/**
 * Created by Herbert on 4/17/2018.
 */

function modifyDOM() {
    let elems = document.body.getElementsByTagName("*");

    let res = [];

    count = 0;
    for (i = 0; i < elems.length;i ++ )
    {
        let jsonData = {};
        if (elems[i].tagName != 'H2' && elems[i].tagName != 'IMG' && elems[i].tagName != 'H1' && elems[i].tagName != 'H3' && elems[i].tagName != 'H4')
        {
            count ++;
            continue;
        }
        jsonData['num'] = count;
        count ++;
        jsonData['tag'] = elems[i].tagName;
        jsonData['bottom'] = elems[i].getBoundingClientRect().bottom;
        jsonData['height'] = elems[i].getBoundingClientRect().height;
        jsonData['width'] = elems[i].getBoundingClientRect().width;
        jsonData['x'] = elems[i].getBoundingClientRect().x;
        jsonData['y'] = elems[i].getBoundingClientRect().y;
        jsonData['left'] = elems[i].getBoundingClientRect().left;
        jsonData['right'] = elems[i].getBoundingClientRect().right;
        jsonData['text'] = elems[i].textContent;
        res.push(jsonData);

    }

    return res;
}
