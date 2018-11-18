import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseComponent} from "./base.component";
import {environment} from "../../environments/environment";
import {AuthService} from "../core/_auth/auth.service";
import {listType} from "../../environments/constants";
declare var $: any;
@Component({
    selector: 'book-list',
    templateUrl: './list.book.component.html'
})
export class ListBookComponent extends BaseComponent implements OnInit, AfterViewInit {

    @Input() type: any;
    title = '';


    id: string;
    options:any;

    static renderActionButton(row): string {
        var temp = '<button name="Edit" href="javascript:void(0)"><i class="fa fa-edit"></i></button>'
            + '<button name="Delete" href="javascript:void(0)"><i class="fa fa-remove"></i></button>';
        return temp;
    }

    onActionButtonClicked(event) {
        const action = event.target.name;
        switch (action) {
            case  'Edit':
                this.update(event.rowData.id);

                break;
            case  'Delete':
                this.confirmDelete(event.rowData.id);

                break;
        }
    }

    update(id) {
    }


    confirmDelete(id) {
    }

    delete(id) {
    }

    constructor(private router: Router, private route: ActivatedRoute, private  as: AuthService) {
        super();
    }


    @ViewChild('repLstDT') repLstDT;

    refreshDT() {
        console.log('refresh DT!');
        const jDataTable = this.repLstDT ? this.repLstDT.jQObject() : null;
        if (jDataTable) {
            jDataTable.ajax.reload();
        }
    }

    ngOnInit() {
        this.title = this.type.des;
        var type_data;
        if (this.type == listType.FRIEND) {
            type_data = this.as.facebookFriendList;
        } else {
            type_data = this.as.getUserId();
        }
        var data = {type: this.type.code, type_data: type_data};
        this.options = this.getDTOptionsWithData(environment.book_service.get_page_endpoint, [{data: "name"},
            {
                data: null,
                render: function (data, type, row, meta) {
                    return ListBookComponent.renderActionButton(row);
                }
            }
        ], data);
    }

    ngAfterViewInit() {

    }
}
