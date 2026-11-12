(() => {
  'use strict';
  const button=document.getElementById('share-video');
  const status=document.getElementById('status');
  if(typeof navigator.share!=='function'||typeof navigator.canShare!=='function')return;
  let file;
  async function prepare() {
    status.textContent='共有用の動画を準備しています。ダウンロードはそのまま利用できます。';
    try {
      const response=await fetch(new URL('ASOBEAT_slot_18s.mp4',location.href),{cache:'force-cache'});
      if(!response.ok)throw new Error('Video unavailable');
      const blob=await response.blob();
      if(blob.size===0||await blob.slice(4,8).text()!=='ftyp')throw new Error('Invalid video');
      file=new File([blob],'ASOBEAT_slot_18s.mp4',{type:'video/mp4'});
      if(!navigator.canShare({files:[file]})) {
        file=null;status.textContent='「動画をダウンロード」から保存してください。';return;
      }
      button.hidden=false;button.disabled=false;
      status.textContent='共有画面の「ビデオを保存」から「写真」に保存できます。';
    }catch {
      file=null;status.textContent='共有の準備ができませんでした。「動画をダウンロード」から保存してください。';
    }
  }
  button.addEventListener('click',async()=>{
    if(!file||button.disabled)return;
    button.disabled=true;
    try {
      // The file is already prepared: share() runs directly in the tap handler.
      await navigator.share({files:[file]});
      status.textContent='共有メニューを閉じました。保存先の「写真」または「ファイル」を確認してください。';
    }catch(error) {
      status.textContent=error.name==='AbortError'
        ?'共有メニューを閉じました。もう一度操作できます。'
        :'共有メニューを開けませんでした。「動画をダウンロード」をお試しください。';
    }finally{button.disabled=false;}
  });
  void prepare();
})();
