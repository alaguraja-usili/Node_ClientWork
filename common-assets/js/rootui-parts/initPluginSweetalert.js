import { $, $doc } from './_utility';

/*------------------------------------------------------------------

  Init Plugin Sweetalert

-------------------------------------------------------------------*/
function initPluginSweetalert() {
    if ( typeof swal === 'undefined' ) {
        return;
    }

    $doc.on( 'click', '.rui-sweetalert', function() {
        const $this = $( this );
        const dataType = $this.attr( 'data-swal-type' );
        const dataTitle = $this.attr( 'data-swal-title' );
        const dataContent = $this.attr( 'data-swal-content' );

        window.swal.fire( dataTitle, dataContent, dataType );
    } );
}

export { initPluginSweetalert };
