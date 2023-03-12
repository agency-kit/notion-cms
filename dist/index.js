import{Client as t,isFullPage as e}from"@notionhq/client";import{NotionBlocksHtmlParser as i}from"@notion-stuff/blocks-html-parser";import o from"lodash";import s from"fs";Object.defineProperty(String.prototype,"slug",{get:function(){return o.kebabCase(this)}}),Object.defineProperty(String.prototype,"route",{get:function(t="/"){return this.padStart(this.length+1,t)}});class a{cms;cmsId;notionClient;parser;constructor(e,o){this.cms={metadata:{},routes:[],siteData:{}},this.cmsId=e,this.notionClient=new t({auth:o}),this.parser=i.getInstance()}_isTopLevelDir(t){return o.isEmpty(t?.properties["parent-page"].relation)}_getBlockName(t){return console.log(t.properties.name,"RESP"),t?.properties.name.title?.[0]?.plain_text}async _getAuthorData(t){const e=t.properties?.Author?.people;let i;return e?.length?(i=await Promise.all(e.map((async t=>await this.notionClient.users.retrieve({user_id:t.id})))).then((t=>{if(t?.length)return t.map((t=>t.name))})),i||[]):[]}_findKey(t,e){let i;return Object.keys(t).some((o=>o===e?(i=t[o],!0):t[o]&&"object"==typeof t[o]?(i=this._findKey(t[o],e),void 0!==i):void 0)),i}async _getPageContent(t){let i;i="page"===t.object?t:await this.notionClient.pages.retrieve({page_id:t.id});const o=await this.notionClient.blocks.children.list({block_id:t.id,page_size:50}),s=this.parser.parse(o.results),a=/<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/;if(e(i)){const t=i&&i?.cover?.external?.url||i?.cover?.file.url||s.match(a)?.[1];return console.log(this._getBlockName(i),"NMAE",this._getBlockName(i)?.slug),{name:this._getBlockName(i)?.slug,authors:await this._getAuthorData(i),coverImage:t,content:s}}return{name:"",authors:[],coverImage:new URL(""),content:""}}async fetchCms(){const t=await this.notionClient.databases.query({database_id:this.cmsId}),i=new Set,a=async t=>{const s=t.properties["parent-page"].relation[0],a=await this.notionClient.pages.retrieve({page_id:s.id});if(e(a)){const e=this._getBlockName(a)?.slug?.route,s=this._findKey(this.cms.siteData,e);if(s){const e=await this._getPageContent(t);s[e.name?.route]||(s[e.name?.route]=e);const o=((t,e)=>{let i;return e.forEach((e=>{t===e.entry&&(i=e)})),i})(t,i);o&&i.delete(o)}else{let s=!0;for(const e of i)if(o.isEqual(t,e.entry)){s=!1;break}s&&i.add({parentName:e,entry:t})}}};for await(const e of t.results)if(this._isTopLevelDir(e)){const t=await this._getPageContent(e),i=this.cms.siteData[this._getBlockName(e)?.slug.route]={...t};if(e.properties["sub-page"].relation.length)for await(const t of e.properties["sub-page"].relation){const e=await this._getPageContent(t);i[e.name?.route]=e}}else await a(e);for(;i.size;){console.log("trigger while",i.size);for await(const t of i)console.log(t.parentName),await a(t.entry),s.writeFileSync("debug/site-data.json",JSON.stringify(this.cms.siteData))}return console.log("complete"),this.cms}}export{a as default};
//# sourceMappingURL=index.js.map
