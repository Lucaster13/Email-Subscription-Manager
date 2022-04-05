import React, {useState} from "react";


export default function SubscriptionView(props) {
    // use state to view specific subscription info
    const [selected, setSelected] = useState(null);
    const {data} = props;
    const dataValid = !!Object.keys(data).length;

    return (
        <div id = "subView">
            {!dataValid && console.alert("No data is present, please reload the page or wait. Thank you!")}
            {dataValid && data && <SubscriptionList data={data} selected={selected} setSelected={setSelected}/>}
            {dataValid && selected && <SubscriptionInfo selected={selected} info={data[selected]}/>}
        </div>
    );
}

const SubscriptionList = (props) => {
    const {data, selected, setSelected} = props;

    const subList = Object.keys(data).reduce((subList, emailAddr, idx) => {
        const {name} = data[emailAddr];
        const isCurrSelected = selected === emailAddr;
        const style = isCurrSelected ? {"backgroundColor": "lightblue"} : {};
        // create react elem
        const elem = (
            <div 
                className="unsubDiv" 
                key={idx} 
                onClick={() => isCurrSelected ? setSelected(null) : setSelected(emailAddr)}
                style={style}>
                <h3>{name}</h3>
            </div>
        );

        subList.push(elem);
        return subList;
    }, []);

    return (
        <div id="subListDiv">
            {subList}
        </div>
    )
}

const SubscriptionInfo = (props) => {
    const {selected, info} = props;
    const {name, emails, unsubLinks} = info;
    return (
        <div id="subInfoDiv">
            <h2>{name}</h2>
            <div id="subInfoBody">
                <div id="subInfoKeys">
                    <h4>Sent From:</h4>
                    <h4>Email Count:</h4>
                </div>
                <div id="subInfoValues">
                    <h4>{selected}</h4>
                    <h4>{emails.length}</h4>
                </div>
            </div>
            <div id="unsubDiv">
                <form action={unsubLinks[unsubLinks.length-1]} method="get" target="_blank">
                    <button id="unsubBtn" type="submit">unsubscribe</button>
                </form>
            </div>
        </div>
    )
}

