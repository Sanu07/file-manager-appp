<svelte:options tag={"file-manager-ui"} />

<script>
	import {FILE_STORE} from './stores'
	import { onDestroy } from 'svelte'

	let fileStores
	let errors = {}
	let sameFileName;

	$:folders = []

	const formValues = {
		name: '',
		type: '',
		folder: 'Root'
	}

	const unsubscribe = FILE_STORE.subscribe(value => {
		fileStores = Object.entries(value)
    })

	function submitForm() {
		errors = {}
    	if (!formValues.name) {
			errors['name'] = 'name is required'
			return false;
		}
		if (!formValues.type) {
			errors['type'] = 'type is required'
			return false;
		}
		if (!formValues.folder) {
			errors['folder'] = 'folder name is required'
			return false;
		}
		if (formValues.type === 'file') {
			let keys = Object.entries(fileStores)
			for (var key in keys) {
				if (keys[key][1][0] === formValues.folder) {
					let fileNames = fileStores[key][1]
					if (fileNames.includes(formValues.name)) {
						sameFileName = true;
						return false;
					}
					fileNames.push(formValues.name)
					fileStores[key][1] = fileNames
				}
			}
			caretDownVisibility[fileStores.length - 1] = "caret caret-down"
			listItemsVisibility[fileStores.length - 1] = "nested active"
		} else {
			let tempFileStores = fileStores;
			const folderName = [];
			folderName.push(formValues.name)
			folderName.push([])
			for (var key in tempFileStores) {
				if (tempFileStores[key][0] === formValues.name) {
					sameFileName = true;
					return false;
				}
			}
			tempFileStores.push(folderName)
			fileStores = tempFileStores
			caretDownVisibility[fileStores.length - 1] = "caret"
		}
		sameFileName = false;
  	}

	function updateFoldersDropdown() {
		let folderNames = []
		if (formValues.type === 'file') {
			let keys = Object.entries(fileStores)
			for (var key in keys) {
				folderNames.push(keys[key][1][0])
			}
		}
		folders = folderNames
	}

	let listItemsVisibility = new Array(fileStores.length).fill("nested");
	let caretDownVisibility = new Array(fileStores.length).fill("caret");

	function toggleExpansion(event, index) {
		caretDownVisibility[index] = event.target.className === "caret" ? "caret caret-down" : "caret"
		if (event.target.parentElement.querySelector(".nested")) {
			listItemsVisibility[index] = event.target.parentElement.querySelector(".nested").className === "nested" ? "nested active" : "nested"
		}
	}

    onDestroy(unsubscribe)
</script>

<div class="container">
	<form on:submit|preventDefault={submitForm}>
		<div class="row">
			<div class="col-20">
				<label for="name">Name</label>
				<input type="text" id="name" bind:value={formValues.name} />
				{#if errors.name}
					<p><small style="color: red"> { errors.name } </small></p>
				{/if}
			</div>
			<div class="col-20">
				<label for="type">Select Type (File/Folder)</label>
				<select id="type" bind:value={formValues.type} on:change="{updateFoldersDropdown}">
					<option value="">Select type</option>
					<option value="file">File</option>
					<option value="folder">Folder</option>
				</select>
				{#if errors.type}
					<p><small style="color: red"> { errors.type } </small></p>
				{/if}
			</div>
			{#if folders.length !== 0}
				<div class="col-20">
					<label for="folder">Select Parent Folder Name</label>
					<select id="folder" bind:value={formValues.folder}>
						{#each folders as folder}
							<option value={folder}>
								{folder}
							</option>
						{/each}
					</select>
				</div>
			{/if}
			{#if errors.folder}
				<p><small style="color: red"> { errors.folder } </small></p>
			{/if}
		</div>
		<div class="row">
			<input type="submit" value="Add"/>
		</div>
		{#if sameFileName}
			<p><small style="color: red">Same file/folder name cannot exist at same path</small></p>
		{/if}
	</form>
</div>

<ol id="myfiles" class="wtree">
	{#each fileStores as [key, value], index (index)}
	{#if key !== 'Root'}
	<li>
		<span class={caretDownVisibility[index]} on:click={(event) => toggleExpansion(event, index)} on:keypress={() => {}}>{key}</span>
		<ol class={listItemsVisibility[index]}>
			{#each value as val, i (i)}
				<li><span>{val}</span></li>
			{/each}
		</ol>
	</li>
	{:else}
		{#each value as val, i (i)}
			<li><span class="root-files">{val}</span></li>
		{/each}
	{/if}
	{/each}
</ol>

<style>
	ol, #myfiles {
		list-style-type: none;
	}

	#myfiles {
		margin: 0;
		padding: 0;
	}

	.caret {
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.caret::before {
		content: "\25B6";
		color: black;
		display: inline-block;
		margin-right: 6px;
	}

	.caret-down::before {
		-ms-transform: rotate(90deg);
		-webkit-transform: rotate(90deg);
		transform: rotate(90deg);
	}

	.nested {
		display: none;
	}

	.active {
		display: block;
	}
	@media screen and (max-width: 600px) {
  .col-25, .col-75, input[type=submit] {
    width: 100%;
    margin-top: 0;
  }
}
.row::after {
  content: "";
  display: table;
  clear: both;
}
.col-20 {
  float: left;
  width: 20%;
  margin-right: 20px;
}
input[type=submit]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
* {
  box-sizing: border-box;
}
input[type=text], select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
input[type=submit] {
  background-color: #04AA6D;
  color: white;
  padding: 12px 20px;
  margin: 20px 0px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: left;
}
input[type=submit]:hover {
  background-color: #45a049;
}


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ol {
  margin-left: 30px;
  counter-reset: item;
}

.wtree li {
  list-style-type: none;
  margin: 10px 0 10px 10px;
  position: relative;
}
.wtree li:before {
  content: "";
  counter-increment: item;
  position: absolute;
  top: -10px;
  left: -30px;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  width: 30px;
  height: 15px;
}
.wtree li:after {
  position: absolute;
  content: "";
  top: 5px;
  left: -30px;
  border-left: 1px solid #ddd;
  border-top: 1px solid #ddd;
  width: 30px;
  height: 100%;
}
.wtree li:last-child:after {
  display: none;
}
.wtree li span {
  display: block;
  border: 1px solid #ddd;
  padding: 10px;
  color: #666666;
  text-decoration: none;
}

.wtree li span:hover, .wtree li span:focus {
  color: #000;
  border: 1px solid #474747;
}
.wtree li span:hover + ol li span, .wtree li span:focus + ol li span {
  color: #000;
  border: 1px solid #474747;
}
.wtree li span:hover + ol li:after, .wtree li span:hover + ol li:before, .wtree li span:focus + ol li:after, .wtree li span:focus + ol li:before {
  border-color: #474747;
}

li span {
  background-color: #DDF3FE;
}
li li span, .root-files {
  background-color: #DDEBC8;
}
.display {
  margin-right: 12px;
  font-weight: bold;
}
</style>