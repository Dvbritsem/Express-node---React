module.exports = {

    //Calc total pages needed//
    numberOfPages: function numberOfPages(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            return 1;
        }
        else {
            return Math.ceil(total / limit);
        }
    },

    //Calc total items currently shown//
    currentItems: function currentItems(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            return total;
        }
        else {
            //More items than limit//
            if (limit < (total - start)) {
                return limit;
            }
            //Less items than limit//
            else {
                return (total - start)
            }
        };
    },

    //Calc current page//
    currentPage: function currentPage(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            return 1;
        }
        else {
            return Math.ceil((start / total) * Math.ceil(total / limit));
        }
    },

    //Calc first item on first page//
    firstPageItem: function firstPageItem(total, start, limit) {
        let itemNumber = 1;
        return itemNumber;
    },

    //Calc first item on last page//
    lastPageItem: function lastPageItem(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            let itemNumber = 1;
            return itemNumber;
        }
        else {
            let itemNumber = ((Math.ceil(total / limit) - 1) * limit + 1);
            return itemNumber
        }
    },

    //Calc previous page first item//
    previousPageItem: function previousPageItem(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            return 1;
        }
        if (((this.currentPage(total, start, limit) - 1) * limit - limit + 1) < 1) {
            return 1;
        }
        else {
            return (this.currentPage(total, start, limit) - 1) * limit - limit + 1; 
        }
    },

    //Calc next page first item//
    nextPageItem: function nextPageItem(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            return 1;
        }
        if ((this.currentPage(total, start, limit) + 1) > this.numberOfPages(total, start, limit)) {
            return this.currentPage(total, start, limit) * limit - limit + 1;
        }
        else {
            return (this.currentPage(total, start, limit) - 1) * limit + limit + 1; 
        }
    },

    //get query string from first page//
    getFirstQueryString: function getFirstQueryString(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            let firstPageQuery = "";
            return firstPageQuery;
        }
        else {
            let firstPageQuery = "?start=" + this.firstPageItem(total, start, limit) + "&limit=" + limit;

            return firstPageQuery;
        }
    },

    //get query string from last page//
    getLastQueryString: function getLastQueryString(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            let lastPageQuery = "";
            return lastPageQuery;
        }
        else {
            let lastPageQuery = "?start=" + this.lastPageItem(total, start, limit) + "&limit=" + limit;

            return lastPageQuery;
        }
    },
    
    //get query string from previous page//
    getPreviousQueryString: function getPreviousQueryString(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            let previousPageQuery = "";
            return previousPageQuery;
        }
        else {
            let previousPageQuery = "?start=" + this.previousPageItem(total, start, limit) + "&limit=" + limit;

            return previousPageQuery;
        }
    },

    //get query string from next page//
    getNextQueryString: function getNextQueryString(total, start, limit) {
        if ((limit < 1) || (start < 1)) {
            let nextPageQuery = "";
            return nextPageQuery;
        }
        else {
            let nextPageQuery = "?start=" + this.nextPageItem(total, start, limit) + "&limit=" + limit;

            return nextPageQuery;
        }
    },

    //Calc page number for start number//
    itemToPageNumber: function itemToPageNumber(total, start, limit, itemNumber) {
        if ((limit < 1) || (start < 1)) {
            return 1;
        }
        else {
            return Math.ceil((itemNumber / total) * (this.numberOfPages(total, start, limit)));
        }
    },

    //Create the pagination//
    createPagination: function createPagination(total, start, limit, req) {
        let currentPage = this.currentPage(total, start, limit);
        let currentItems = this.currentItems(total, start, limit);
        let totalPages = this.numberOfPages(total, start, limit);
        let totalItems = total;
        
        let firstPageItemPage = this.itemToPageNumber(total, start, limit, this.firstPageItem(total, start, limit));
        let firstPageItemQuery = this.getFirstQueryString(total, start, limit);

        let lastPageItemPage = this.itemToPageNumber(total, start, limit, this.lastPageItem(total, start, limit));
        let lastPageItemQuery = this.getLastQueryString(total, start, limit);

        let previousPageItemPage = this.itemToPageNumber(total, start, limit, this.previousPageItem(total, start, limit));
        let previousPageItemQuery = this.getPreviousQueryString(total, start, limit);

        let nextPageItemPage = this.itemToPageNumber(total, start, limit, this.nextPageItem(total, start, limit));
        let nextPageItemQuery = this.getNextQueryString(total, start, limit);

        let pagination = {
            "currentPage": currentPage,
            "currentItems": currentItems,
            "totalPages": totalPages,
            "totalItems": totalItems,
            "_links": {
                "first": {
                    "page": firstPageItemPage,
                    "href": "http://" + req.headers.host + "/api/afspraken" + firstPageItemQuery,
                },
                "last": {
                    "page": lastPageItemPage,
                    "href": "http://" + req.headers.host + "/api/afspraken" + lastPageItemQuery,
                },
                "previous": {
                    "page": previousPageItemPage,
                    "href": "http://" + req.headers.host + "/api/afspraken" + previousPageItemQuery,
                },
                "next": {
                    "page": nextPageItemPage,
                    "href": "http://" + req.headers.host + "/api/afspraken" + nextPageItemQuery,
                },
            },
        };

        return pagination;
    },
}