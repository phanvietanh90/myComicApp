import {Component, OnInit, ViewChild} from '@angular/core';
import {FadeInTop} from '../../shared/animations/fade-in-top.decorator';
import {BaseComponent} from "../../base/base.component";
import {FacebookService, InitParams} from "../../../../node_modules/ngx-facebook";
import {NodeEvent, Tree, TreeModel} from 'ng2-tree';
import {ActivatedRoute} from "@angular/router";
import {BookService} from "../../+service/book.service";
import {BookNode} from "../../bo/book.node";
import {AuthService} from "../../core/_auth/auth.service";
import {treeNodeLevel} from "../../../environments/constants";
import {AppComponent} from "../../../+fabric/app.component";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.css']
})
export class StoryComponent extends BaseComponent implements OnInit {
    id: any;
    type: any;
    book: any;
    prevNode: Tree;
    nodeIdIndex: number = 0;
    subTopicLink: any;

    @ViewChild('fabric') fabricComponent: AppComponent;

    constructor(private fb: FacebookService, private route: ActivatedRoute, private bs: BookService, private as: AuthService) {
        super();
    }

    public tree: TreeModel;
    @ViewChild('bookTree') bookTree;
    showFabric: boolean = false;
    showFbComponent: boolean = false;

    increaseNodeIdIndex() {
        this.nodeIdIndex = this.nodeIdIndex + 1;
    }

    genNodeId() {
        this.increaseNodeIdIndex();
        return 'node-' + this.nodeIdIndex;
    }

    buildTreeModelFromBook() {
        let treeModel: any = {};
        treeModel.value = this.book.name;
        let bookChildren: BookNode[] = [];
        treeModel.children = bookChildren;
        treeModel.icon = "fa fa-book";
        treeModel.type = treeNodeLevel.BOOK;
        treeModel.dbId = this.book.id;
        treeModel.id = this.genNodeId();
        for (let chapter of this.book.chapterEntityList) {
            let chapterChildren: BookNode[] = [];
            let chapterNode: BookNode = {
                value: chapter.name,
                children: [],
                icon: 'fa-file-text-o',
                id: this.genNodeId(),
                dbId: chapter.id
            };
            chapterNode.children = chapterChildren;
            bookChildren.push(chapterNode);
            for (let topic of chapter.topicEntityList) {
                let topicChildren: BookNode[] = [];
                let topicNode: BookNode = {
                    value: topic.name,
                    children: [],
                    icon: "fa-file-text",
                    dbId: topic.id,
                    id: this.genNodeId()
                };
                topicNode.children = topicChildren;
                chapterChildren.push(topicNode);

                for (let subTopic of topic.subTopicEntityList) {
                    let subTopicNode = {
                        value: subTopic.name,
                        children: [],
                        icon: "fa-pencil",
                        dbId: subTopic.id,
                        id: this.genNodeId(),
                        content: subTopic.content
                    };
                    this.subTopicContent[subTopicNode.id] = subTopicNode.content;
                    topicChildren.push(subTopicNode);
                }
            }
        }
        treeModel.settings = this.tree_model_settings;
        if (!this.isMyBook()) {
            treeModel.settings.menuItems = [];
        }
        this.tree = treeModel;
        console.log('tree model: ' + JSON.stringify(this.tree));
    }

    isMyBook() {
        return ((!this.book) || (this.book.userEntity.id == this.as.getUserId()));
    }

    ngOnInit() {
        // this.initFB();
        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            this.type = this.compType.UPDATE;
            this.bs.getBookById(this.id).subscribe(response => {
                    console.log('res: ' + JSON.stringify(response));
                    let getResult = response.success;
                    if (getResult == true) {
                        this.book = response.dataResponse;
                        this.buildTreeModelFromBook();
                    } else {
                        this.errorAlert(response.exceptionMessage);
                    }
                },
                error => {
                    this.errorAlert("Has error!");
                })

        } else {
            this.type = this.compType.SAVE;
            let treeModel: any = {};
            treeModel.value = 'Insert title here';
            treeModel.type = treeNodeLevel.BOOK;
            let bookChildren: BookNode[] = [];
            treeModel.children = bookChildren;
            treeModel.settings = this.tree_model_settings;
            this.tree = treeModel;
        }
    }

    initFB() {
        let initParams: InitParams = {
            appId: '163456804604097',
            cookie: true,
            xfbml: true,
            version: 'v2.9',
        };
        this.fb.init(initParams);
    }


    handleRemoved($event) {
        console.log('tree model after remove: ' + JSON.stringify(this.tree));

    }

    handleRenamed($event) {

    }

    handleNextLevel($event) {

    }

    handleCollapsed($event) {

    }

    handleExpanded($event) {

    }

    handleCreated(e: NodeEvent) {
        this.bookTree.getControllerByNodeId(e.node.id).changeNodeId(this.genNodeId());
        let nodeLevel = this.getLevelOfNode(e.node);
        if (nodeLevel > treeNodeLevel.SUB_TOPIC) {
            e.node.removeItselfFromParent();
            this.errorAlert("You can not add sub topic child!");
        }
    }

    handleMoved($event) {
        alert('ok');
    }

    getLevelOfNode(node: Tree) {
        let level = 1;
        while (node.parent != null) {
            level = level + 1;
            node = node.parent;
        }
        return level;
    }

    handleSelected(e: NodeEvent) {
        if (this.prevNode) {
            let prevNodeLevel = this.getLevelOfNode(this.prevNode);
            console.log('prev node id 222: ' + this.prevNode.id);
            if (prevNodeLevel == treeNodeLevel.SUB_TOPIC) {
                this.subTopicContent[this.prevNode.id] = this.getJsonFromCanvas(this.fabricComponent.canvas);
            }
        }
        this.prevNode = e.node;
        let nodeLevel = this.getLevelOfNode(e.node);
        console.log('node level: ' + nodeLevel);
        if (nodeLevel == treeNodeLevel.SUB_TOPIC) {
            if (e.node.toTreeModel().dbId) {
                this.subTopicLink = environment.fb_sub_topic_url + e.node.toTreeModel().dbId;
                console.log('facebook href: ' + this.subTopicLink);
                this.initFB();
                this.showFbComponent = true;
            } else {
                this.showFbComponent = false;
            }

            this.showFabric = true;
            let content = this.subTopicContent[e.node.id];
            if (!content) {
                content = e.node.toTreeModel().content;
            }
            if (this.fabricComponent && content) {
                localStorage.setItem('Kanvas', content);
                this.fabricComponent.loadCanvasFromJSON();
            } else {
                this.fabricComponent.canvas.clear();
            }
        } else if (this.showFabric) {
            this.showFabric = false;
            this.showFbComponent = false;
        }
    }

    subTopicContent: any = {};

    onNodeUnselected(e: NodeEvent) {
    }

    buildBookEntityFromModel(treeModel: TreeModel): any {
        let bookEntity: any = {};
        bookEntity.name = treeModel.value;
        bookEntity.userEntity = {id: this.as.getUserId()};
        bookEntity.chapterEntityList = [];
        if (this.type == this.compType.UPDATE) {
            bookEntity.id = this.id;
        }

        for (let chapterModel of treeModel.children) {
            let chapterEntity: any = {};
            chapterEntity.name = chapterModel.value;
            chapterEntity.id = chapterModel.dbId;
            bookEntity.chapterEntityList.push(chapterEntity);
            chapterEntity.topicEntityList = [];
            for (let topicModel of chapterModel.children) {
                let topicEntity: any = {};
                topicEntity.name = topicModel.value;
                topicEntity.id = topicModel.dbId;
                chapterEntity.topicEntityList.push(topicEntity);
                topicEntity.subTopicEntityList = [];
                for (let subTopicModel of topicModel.children) {
                    let subTopicEntity: any = {};
                    subTopicEntity.name = subTopicModel.value;
                    subTopicEntity.id = subTopicModel.dbId;
                    subTopicEntity.content = this.subTopicContent[subTopicModel.id];
                    topicEntity.subTopicEntityList.push(subTopicEntity);
                }
            }

        }

        return bookEntity;
    }

    saveOrUpdateBook() {
        if (this.confirm("Do you want to save book?")) {
            if (this.prevNode) {
                let prevNodeLevel = this.getLevelOfNode(this.prevNode);
                console.log('id node before save: ' + this.prevNode.id);
                if (prevNodeLevel == treeNodeLevel.SUB_TOPIC) {
                    this.subTopicContent[this.prevNode.id] = this.getJsonFromCanvas(this.fabricComponent.canvas);
                }
            }

            let bookEntity: any = this.buildBookEntityFromModel(this.bookTree.getController().toTreeModel());
            console.log('save book: ' + JSON.stringify(bookEntity));

            if (this.type == this.compType.UPDATE) {
                this.bs.update(bookEntity).subscribe(response => {
                        console.log('res: ' + JSON.stringify(response));
                        let updateResult = response.success;
                        if (updateResult == true) {
                            this.successAlert("Update book success!");
                        } else {
                            this.errorAlert(response.exceptionMessage);
                        }
                    },
                    error => {
                        this.errorAlert("Has error!");
                    })
            } else {
                this.bs.save(bookEntity).subscribe(response => {
                        console.log('res: ' + JSON.stringify(response));
                        let createResult = response.success;
                        if (createResult == true) {
                            this.successAlert("Create book success!");
                        } else {
                            this.errorAlert(response.exceptionMessage);
                        }
                    },
                    error => {
                        this.errorAlert("Has error!");
                    })
            }
        }
    }

}