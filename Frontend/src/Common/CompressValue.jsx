
const compressValue = (value) => {
    let result;

    if (value < 1000) {
        result = value;
    }

    else if (value >= 1000 && value < 1000000) {
        if (value % 1000 == 0) {
            result = (value / 1000) + "K";
        }

        else {
            let view = (value / 1000).toString();
            let constant = view.split(".")[0];
            let decimal = view.split(".")[1];
            result = constant + "." + decimal.slice(0,2) + "K"
        }
    }

    else if (value >= 1000000 && value < 10000000) {
        if (value % 1000000 == 0) {
            result = (value / 1000000) + "M";
        }

        else {
            let view = (value / 1000000).toString();
            let constant = view.split(".")[0];
            let decimal = view.split(".")[1];
            result = constant + "." + decimal.slice(0,2) + "M"

        }
    }

    else if (value >= 10000000) {
        if (value % 10000000 == 0) {
            result = (value / 10000000) + "Cr";
        }

        else {
            let view = (value / 10000000).toString();
            let constant = view.split(".")[0];
            let decimal = view.split(".")[1];
            result = constant + "." + decimal.slice(0,2) + "Cr"
        }
    }

    return result;
}

export default compressValue;