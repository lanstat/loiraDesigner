Loira.XmiParser = {
    load : function(data, canvas){
        var xmlDoc = null;
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
        } else {
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(data);
        }
        var elements = this._parse(xmlDoc);
        var symbols = {};

        for (var key in elements.symbols){
            var element = elements.symbols[key];
            if (element.type == 'UML:UseCase'){
                symbols[element.id] = new UseCase.UseCase({text: element.name});
            } else if (element.type == 'UML:Actor'){
                symbols[element.id] = new Common.Actor({text: element.name});
            }
            canvas.add(symbols[element.id]);
        }

        for (var key in elements.relations){
            var element = elements.relations[key];
            if (element.type == 'UML:Association'){
                var options = {};
                for (var i = 0; i < element.connection.length; i++){
                    if (element.connection[i]['taggedValues']['ea_end'] == 'source'){
                        options['start'] = symbols[element.connection[i]['type']];
                    } else if (element.connection[i]['taggedValues']['ea_end'] == 'target'){
                        options['end'] = symbols[element.connection[i]['type']];
                    }
                }

                canvas.addRelation(new Relation.Association(options));
            }
        }

        setTimeout(function(){
            canvas.renderAll();
        }, 50);
    },
    _parse : function(data){
        var root = this._xmlToJson(data);
        var items = root['XMI']['XMI.content']['UML:Model']['UML:Namespace.ownedElement']['UML:Package']['UML:Namespace.ownedElement'];
        var symbols = {};
        var relations = {};

        for (var key in items){
            if(items.hasOwnProperty(key)){
                if (typeof items[key] === 'string'){

                } else {
                    var id = items[key]['@attributes']['xmi.id'];

                    if(typeof items[key]['UML:Association.connection'] !== 'undefined'){
                        relations[id] = {
                            isAbstract: items[key]['@attributes']['isAbstract'] == 'true',
                            isLeaf: items[key]['@attributes']['isLeaf'] == 'true',
                            isRoot: items[key]['@attributes']['isRoot'] == 'true',
                            visibility: items[key]['@attributes']['visibility'],
                            id: items[key]['@attributes']['xmi.id'],
                            type: key,
                            connection: []
                        };

                        for (var i = 0; i < items[key]['UML:Association.connection']['UML:AssociationEnd'].length; i++){
                            var end = items[key]['UML:Association.connection']['UML:AssociationEnd'][i];

                            var connection = {
                                aggregation : end['@attributes']['aggregation'],
                                changeable : end['@attributes']['changeable'],
                                isNavigable : end['@attributes']['isNavigable'] == 'true',
                                isOrdered : end['@attributes']['isOrdered'] == 'true',
                                targetScope : end['@attributes']['targetScope'],
                                type :  end['@attributes']['type'],
                                visibility : end['@attributes']['visibility'],
                                taggedValues : {}
                            };

                            for (var j = 0; j < end['UML:ModelElement.taggedValue']['UML:TaggedValue'].length; j++){
                                var tagged = end['UML:ModelElement.taggedValue']['UML:TaggedValue'][j]['@attributes'];
                                connection.taggedValues[tagged['tag']] = tagged['value'];
                            }

                            relations[id]['connection'].push(connection);
                        }
                    } else {
                        symbols[id] = {
                            isAbstract: items[key]['@attributes']['isAbstract'] == 'true',
                            isLeaf: items[key]['@attributes']['isLeaf'] == 'true',
                            isRoot: items[key]['@attributes']['isRoot'] == 'true',
                            name: items[key]['@attributes']['name'],
                            namespace: items[key]['@attributes']['namespace'],
                            visibility: items[key]['@attributes']['visibility'],
                            id: items[key]['@attributes']['xmi.id'],
                            type: key
                        };
                    }
                }
            }
        }

        return {symbols: symbols, relations: relations};
    },
    _xmlToJson : function (xml) {
        var obj = {};

        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = this._xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this._xmlToJson(item));
                }
            }
        }
        return obj;
    }
};