<script src="https://unpkg.com/lucide@latest"></script>
<script>
   lucide.createIcons();
</script>
<script>
   const desktopBtn = document.getElementById('preview-desktop');
   const tabletBtn = document.getElementById('preview-tablet');
   const container = document.getElementById('preview-container');
   
   function setPreview(mode){
   
       desktopBtn.classList.remove('active','bg-zinc-700','text-white');
       tabletBtn.classList.remove('active','bg-zinc-700','text-white');
   
       if(mode === 'desktop'){
           container.className = "transition-all duration-300 w-full h-full";
           desktopBtn.classList.add('bg-zinc-700','text-white');
       }
   
       if(mode === 'tablet'){
           container.className = "transition-all duration-300 h-full max-w-4xl aspect-[9/16]";
           tabletBtn.classList.add('bg-zinc-700','text-white');
       }
   }
   
   desktopBtn.addEventListener('click', ()=> setPreview('desktop'));
   tabletBtn.addEventListener('click', ()=> setPreview('tablet'));
</script>
<style>
   ::-webkit-scrollbar { width: 8px; }
   ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.1); }
   ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.4); border-radius: 4px; }
   ::-webkit-scrollbar-thumb:hover { background: rgba(100,116,139,0.6); }
   .resize-left { resize: horizontal; overflow: auto; direction: rtl; }
   .resize-left iframe { direction: ltr; }
   @keyframes fade-in-up {
   from { opacity:0; transform:translateY(10px); }
   to { opacity:1; transform:translateY(0); }
   }
   .animate-fade-in-up {
   animation: fade-in-up 0.3s ease-out;
   }
</style>
<script>
function openModal(id) {

    const modal = document.getElementById(id);
    const panel = modal.querySelector('.modal-panel');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        panel.classList.remove('opacity-0','scale-95');
        panel.classList.add('opacity-100','scale-100');
    });
}

function closeModal(id) {

    const modal = document.getElementById(id);
    const panel = modal.querySelector('.modal-panel');

    modal.classList.add('opacity-0');
    panel.classList.add('opacity-0','scale-95');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },200);
}
</script>
