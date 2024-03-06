'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">AWS S3</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/S3Sdk.html" data-type="entity-link" >S3Sdk</a>
                            </li>
                            <li class="link">
                                <a href="classes/SdSdkError.html" data-type="entity-link" >SdSdkError</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DeleteObjectData.html" data-type="entity-link" >DeleteObjectData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteObjectProps.html" data-type="entity-link" >DeleteObjectProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeneratePresignedUrlData.html" data-type="entity-link" >GeneratePresignedUrlData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GeneratePresignedUrlProps.html" data-type="entity-link" >GeneratePresignedUrlProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetObjectData.html" data-type="entity-link" >GetObjectData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetObjectProps.html" data-type="entity-link" >GetObjectProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListObjectsV2Data.html" data-type="entity-link" >ListObjectsV2Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListObjectsV2Props.html" data-type="entity-link" >ListObjectsV2Props</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PutObjectAclData.html" data-type="entity-link" >PutObjectAclData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PutObjectAclProps.html" data-type="entity-link" >PutObjectAclProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PutObjectData.html" data-type="entity-link" >PutObjectData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PutObjectProps.html" data-type="entity-link" >PutObjectProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/S3Object.html" data-type="entity-link" >S3Object</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/S3SdkConfig.html" data-type="entity-link" >S3SdkConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/S3SdkErrorMap.html" data-type="entity-link" >S3SdkErrorMap</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});