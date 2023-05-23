<script>
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import MenuSurface from '@smui/menu-surface';
    import FileManager from './components/FileManager.svelte';

	let ls = null;
	let invalidCreds;
	let emptyCreds;
	let prominent = false;
  	let dense = true;
  	let secondaryColor = false;

	onMount(() => {
		typeof localStorage !== `undefined` && (ls = localStorage);
		ls.setItem(`username`, `nagp_user`)
		ls.setItem(`password`, `cGFzc3cwcmQ=`);
    });

  const formValues = {
	username: '',
	password: ''
  }

  let isFileManagerVisible = false;
	function toggleVisible() {
		if (!formValues.username || !formValues.password) {
			emptyCreds = true;
			return false;
		}
		emptyCreds = false;
		if (!!ls && formValues.username === ls.getItem(`username`) && formValues.password === ls.getItem(`password`)) {
			invalidCreds = false;
			secondaryColor = true
			isFileManagerVisible = !isFileManagerVisible
		} else {
			invalidCreds = true;
			return false;
		}
	}
</script>
 <div class="container-margin">
	<div class="flexy">
		<div class="top-app-bar-container flexor">
			<TopAppBar
			  variant="static"
			  {prominent}
			  {dense}
			  color={secondaryColor ? 'secondary' : 'primary'}
			>
			  <Row>
				<Section>
				  <IconButton class="material-icons">menu</IconButton>
				  <Title>NAGP Svelte Assignment</Title>
				</Section>
				<Section align="end" toolbar>
				  <IconButton class="material-icons" aria-label="star"
					>star</IconButton
				  >
				  <IconButton class="material-icons" aria-label="upload file"
					>upload_file</IconButton
				  >
				  <IconButton class="material-icons" aria-label="Bookmark this page"
					>bookmark</IconButton
				  >
				</Section>
			  </Row>
			</TopAppBar>
			{#if !isFileManagerVisible}
			<div class="flexor-content">
				<div class="row">
					<Textfield
					class="shaped-outlined"
					variant="outlined"
					bind:value={formValues.username}
					label="username"
					>
					<HelperText slot="helper">Default username: <b><i>nagp_user</i></b></HelperText>
					</Textfield>
				</div>
				<div class="row">
					<Textfield
					class="shaped-outlined"
					variant="outlined"
					type="password"
					bind:value={formValues.password}
					label="password"
					>
					<HelperText slot="helper">Default password: <b><i>cGFzc3cwcmQ=</i></b></HelperText>
					</Textfield>
				</div>
				{#if invalidCreds}
					<p style="color: red;"><i>Invalid credentials</i></p>
				{/if}
				{#if emptyCreds}
					<p style="color: red;"><i>Empty credentials</i></p>
				{/if}
				<Button on:click={toggleVisible} variant="raised" class="button-shaped-round">
					<Label>Login</Label>
				</Button>
			</div>
			<div>
				<MenuSurface static style="max-width: 400px; margin: 0px 0px 100px 50px">
					<p style="margin: 1em;">Name: <b><i>Sanu Ghosh</i></b></p>
					<p style="margin: 1em;">Email: <b><i>sanu.ghosh@nagarro.com</i></b></p>
					<p style="margin: 1em;">Employee Id: <b><i>3151843</i></b></p>
				</MenuSurface>
			</div>
			{:else}
				<FileManager/>
			{/if}
		  </div>
	</div>
 </div>

  <svelte:head>
	<!-- Fonts -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">
	
  <!-- Material Typography -->
	<link rel="stylesheet" href="https://unpkg.com/@material/typography@14.0.0/dist/mdc.typography.css" />
	
	<!-- SMUI -->
	<link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>
<style>
	.container-margin {
		margin: 0px 20px;
	}
	.row {
		display: table;
  		clear: both;
	}
	.top-app-bar-container {
    max-width: 98%;
    width: 100%;
    height: 700px;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    background-color: var(--mdc-theme-background, #fff);
    display: inline-block;
  }
 
  @media (max-width: 480px) {
    .top-app-bar-container {
      margin-right: 0;
    }
  }
 
  .flexy {
    display: flex;
    flex-wrap: wrap;
  }
 
  .flexor {
    display: inline-flex;
    flex-direction: column;
  }
 
  .flexor-content {
    flex-basis: 0;
    height: 0;
    flex-grow: 1;
    overflow: auto;
	margin-top: 30px;
	margin-left: 40%;
	padding-top: 20px;
  }
</style>