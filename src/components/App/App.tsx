// @ts-ignore TODO: remove after TS release
import React, { useState } from 'react';
import './App.css';
import Apptree from '../Apptree/Apptree';

import { 
	ReactiveBase, ResultList, ReactiveList, SelectedFilters, DataSearch
} from '@appbaseio/reactivesearch';

// import nodes from '../../assests/familyData/sample.json';
// const myID = 'root';

// import nodes from '../../assests/familyData/mePhoto.json';
// const myID = 'father';

import nodes from '../../assests/familyData/relationship.json';
const myID = '1d48f64a-ca26-405b-81dc-8de0393a6f28';

const AppSearcher = () => {
	const [newNodes, setNodes] = useState(nodes);
	const [newID, setID] = useState(myID);
	const booksList = (data: any) => {
		return  <ResultList key={data._id}>
			<ResultList.Image src={(JSON.parse(data.relationships[0])["images"].length)?JSON.parse(data.relationships[0])["images"]:"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"} />
			{/* <ResultList.Image src={"https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"} /> */}
			<ResultList.Content>
				<ResultList.Title
					dangerouslySetInnerHTML={{
						__html: (JSON.parse(data.relationships[0])["fname"] && JSON.parse(data.relationships[0])["fname"].length)? JSON.parse(data.relationships[0])["fname"] + ' ' + JSON.parse(data.relationships[0])["lname"]:'Nick Name'
					}}
				/>
				<ResultList.Description>
					<div className="flex column justify-space-between">
						{/* <div>Family_Code: <span className="authors-list">{data.family_code[0]}</span></div> */}
						{/* <div>ID: <span className="authors-list">{data._id}</span></div> */}
						{/* <div><span className="authors-list">{JSON.parse(data.relationships[0])["fname"] + ' ' + JSON.parse(data.relationships[0])["lname"]}</span></div> */}
						<div><span className="authors-list">{(JSON.parse(data.relationships[0])["birth"] && JSON.parse(data.relationships[0])["birth"].length)? JSON.parse(data.relationships[0])["birth"] + '/' + JSON.parse(data.relationships[0])["death"]:'birth/death'}</span></div>
						{/* <div><span className="authors-list">{JSON.parse(data.relationships[0])["death"]}</span></div> */}
						{/* <div>Images: <span className="authors-list">{JSON.parse(data.relationships[0])["images"]}</span></div> */}
					</div>
				</ResultList.Description>
			</ResultList.Content>
		</ResultList>
	};

	const onUpdate = (data: any) => {
		if(!data.data.length) {
			console.log("returned!");
			return;
		}
		let prenodes = makeNodes(data);		
		function makeNodes(data: any) {			
			let preData = data.data, lenData = preData.length;
			let prenodes = [], prenode, i;
			for (i = 0; i < lenData; i++){
				prenode = JSON.parse(preData[i]["relationships"][0]);
				prenode["family_code"] = preData[i]["family_code"];
				prenode["images"] = prenode["images"][0];
				prenodes.push(prenode);
				prenode=[];
			}			
			return prenodes;
		}
		function checknode(keyword:string, set:object) {
			let checked = 0;
			if(Object.values(set).indexOf(keyword) > -1) {
				checked = 1;
			} else {
				checked = 0;
			}
			return checked;
		}
		let preid, preids=[], firstId=prenodes[0]["id"];
		for(let i = 0; i < prenodes.length; i++) {
			preids.push(prenodes[i]["id"]);
		}		
		for(let i = 0; i < preids.length; i++) {
			preid = preids[i];
			let checkingKey = ["parents", "siblings", "spouses", "children"], isCnt = 1, nodeNum = 0;
			for(let k = 0; k < checkingKey.length; k++) {
				let cntKey = checkingKey[k];
				if(prenodes[i][cntKey].length) {
					nodeNum += prenodes[i][cntKey].length;
					for(let j = 0; j < prenodes[i][cntKey].length; j++) {
						let checkid = prenodes[i][cntKey][j]["id"];
						isCnt = checknode(checkid, preids);
						if(isCnt) {
							continue;
						} else {
							break;
						}
					}
				} else {
					isCnt = 1;
				}
				if(isCnt) {
					continue;
				} else {
					break;
				}
			}
			if(isCnt && nodeNum) {
				break;
			} else {
				nodeNum = 0;
				continue;
			}	
		}
		function export2txt(originalData: object) {
			const a = document.createElement("a");
			a.href = URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 2)], {
				type: "text/plain"
			}));
			a.setAttribute("download", "relationship.txt");
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}	
		console.log("Prenodes:", prenodes);
		if(prenodes[0]["family_code"] == "390822") {
			console.log("Checked Preid:", preid, firstId, prenodes);
			setNodes(prenodes);
			// setID(preid);
			setID(preids[7]);
			// export2txt(prenodes);
		} else {
			setNodes(nodes);
			setID(myID);
		}	
	}

	return (
		<div className="root">
			<ReactiveBase
				app = 'elasticsearch_index_bitnami_drupal8_attendee'
				credentials = 'elastic:Uh44gjyJ78iGYMzMez0WJI7L'
				url = 'https://db170860be1944a39e20206e398f370c.eu-west-1.aws.found.io:9243'
			>
				<div className="row">
					<div className="col">
						<DataSearch
							className="dataSearch"
							dataField={["family_code"]}
							componentId="Family Code"
							placeholder="Family Code"
						/>
					</div>

					<label className="searchlabel">
						<input type="checkbox" />
						<div className="col" id="searchlist">
							<SelectedFilters />
							<ReactiveList
								componentId="SearchResult"
								dataField="family_code"
								// from={0}
								size={30}
								onData={onUpdate}
								className="result-list-container"
								renderItem={booksList}
								pagination={false}
								react={{
									and: ['Family Code'],
								}}
							/>
						</div>
					</label>					
					
				</div>
			</ReactiveBase>
			<Apptree 
				myID={newID}
				nodes={newNodes}
			/>
		</div>
	);
};

export default AppSearcher;
