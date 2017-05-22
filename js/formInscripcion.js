Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'ext/examples/ux');

Ext.require([
    //'Ext.form.*',
    //'Ext.layout.container.Column',
    //'Ext.tab.Panel'
    '*',
    'Ext.form.*',
    'Ext.Img',
    'Ext.tip.QuickTipManager',
    'Ext.ux.DataTip'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();

    var bd = Ext.getBody();

    /*
     * ================  Simple form  =======================
     */
    //bd.createChild({tag: 'h2', html: 'Form 1 - Very Simple'});

    var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

    var simple = Ext.widget({
        xtype: 'form',
        layout: 'form',
        collapsible: true,
        id: 'simpleForm',
        url: 'save-form.php',
        frame: true,
        title: 'Formulario de inscripción',
        bodyPadding: '5 5 0',
        width: 350,
        fieldDefaults: {
            msgTarget: 'side',
            labelWidth: 75
        },
        plugins: {
            ptype: 'datatip'
        },
        defaultType: 'textfield',
        items: [{
            fieldLabel: 'Nombre',
            afterLabelTextTpl: required,
            name: 'nm',
            allowBlank: false,
            tooltip: 'Ingresa tu nombre'
        },{
            fieldLabel: 'Telefono',
            afterLabelTextTpl: required,
            name: 'tel',
            allowBlank: false,
            tooltip: 'Ingresa un numero telefónico donde podamos contactarnos contigo'
        }, {
            fieldLabel: 'Correo',
            afterLabelTextTpl: required,
            name: 'email',
            allowBlank: false,
            vtype:'email',
            tooltip: 'Ingresa tu correo electrónico'
        },{
            fieldLabel: 'Empresa',
            afterLabelTextTpl: required,
            name: 'empresa',
            allowBlank: false,
            tooltip: "Ingresa el nombre de la plantación"
        },{
            fieldLabel: 'Nit',
            afterLabelTextTpl: required,
            name: 'nit',
            allowBlank: false,
            tooltip: "Ingresa el NIT de la plantación"
        },{
            fieldLabel: 'Pais',
            afterLabelTextTpl: required,
            name: 'pais',
            allowBlank: false,
            tooltip: "Ingresa el pais de la plantación"
        },{
            fieldLabel: 'Ciudad',
            afterLabelTextTpl: required,
            name: 'ciud',
            allowBlank: false,
            tooltip: "Ingresa la ciudad de la plantación"
        }
        ,{
            xtype:'fieldset',
            title: 'Coordenadas Plantación',
            collapsible: false,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: 'Latitud',
                afterLabelTextTpl: required,
                name: 'lat',
                allowBlank: false,
                tooltip: "Ingresa la latitud donde se encuentra la plantación"
            },{
                fieldLabel: 'Longitud',
                afterLabelTextTpl: required,
                name: 'lon',
                allowBlank: false,
                tooltip: "Ingresa la longitud donde se encuentra la plantación"
            }]
        },{
            xtype:'fieldset',
            title: '',
            collapsible: false,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items :[{
                fieldLabel: 'Nombre de usuario',
                afterLabelTextTpl: required,
                name: 'logon',
                allowBlank: false,
                minLength: 6,
                tooltip: "Ingrese el nombre de usuario con el que desea ingresar al sistema"
            },{
                xtype: 'textfield',
                name: 'contrasena',
                fieldLabel: 'Contraseña',
                inputType: 'password',
                style: 'margin-top:15px',
                allowBlank: false,
                minLength: 6
            }, {
                xtype: 'textfield',
                name: 'password2',
                fieldLabel: 'Repita la contraseña',
                inputType: 'password',
                allowBlank: false,
                /**
                 * Custom validator implementation - checks that the value matches what was entered into
                 * the password1 field.
                 */
                validator: function(value) {
                    var password1 = this.previousSibling('[name=contrasena]');
                    return (value === password1.getValue()) ? true : 'Las contraseñas no coinciden.'
                }
            }]
        }],

        buttons: [{
            text: 'Guardar',
            handler: function() {
                if(this.up('form').getForm().isValid())
                    guardar(this.up('form').getForm());
            }
        },{
            text: 'Cancelar',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }]
    });

    simple.render(document.getElementById("forma"));
});

function guardar(form)
{
    var nm=form.getValues()['nm'];
    var tel=form.getValues()['tel'];
    var email=form.getValues()['email'];
    var empresa=form.getValues()['empresa'];
    var nit=form.getValues()['nit'];
    var pais=form.getValues()['pais'];
    var ciud=form.getValues()['ciud'];
    var lat=form.getValues()['lat'];
    var lon=form.getValues()['lon'];
    var logon=form.getValues()['logon'];
    var pass=form.getValues()['contrasena'];
    
    var cad="nm="+nm+"&tel="+tel+"&email="+email+"&empresa="+empresa+"&nit="+nit+"&lat="+lat+"&lon="+lon+"&pais="+pais+"&ciud="+ciud+"&logon="+logon+"&pass="+pass;
     $.ajax({
          url: 'http://192.168.1.21/app_dev.php/ws/CrearEmpresaDemo',
          type: 'POST',
          async: true,
          data: cad,
          success: ResponseDml,
          error: muestraError	
     });
}

function ResponseDml(datos)
{
    if(datos.error<0)
    {
        Ext.Msg.alert('Mensaje de error', datos.mensaje+"<br>Error: "+datos.error);
    }
    else
    {
        var msg= "Tu registro se ha creado con exito.<br> Ya puedes utilizar nuestro sistema desde esta dirección: http://sigaind.com.co/demo/<br>";
        msg+="Recuerda que el ID de tu empresa es: "+datos.id;
        Ext.Msg.alert('Registro creado con éxito',msg);
        
        form.getValues()['nm']="";
        form.getValues()['tel']="";
        form.getValues()['email']="";
        form.getValues()['empresa']="";
        form.getValues()['nit']="";
        form.getValues()['pais']="";
        form.getValues()['ciud']="";
        form.getValues()['lat']="";
        form.getValues()['lon']="";
        form.getValues()['logon']="";
        form.getValues()['contrasena']="";
    }
}

function muestraError(error)
{
    Ext.Msg.alert('Mensaje de error', "Error en la transacción: "+error);
    
}
