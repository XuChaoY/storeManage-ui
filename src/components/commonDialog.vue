<template>
  <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  :width="width+'px'">
  <slot></slot>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sure()">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
    name:'commonDialog',
    props:{
        value:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:"",
        },
        width:{
            type:Number,
            default:500
        }
    },
    data(){
        return {
            dialogVisible:false,
        }
    },
    watch:{
        value:{
            handler(val){
                this.dialogVisible = val;
            },
            immediate:true
        },
        dialogVisible(val){
            this.$emit('input', val);
        }
    },
    methods:{
        sure(){
            this.$emit('submit');
        }
    }
}
</script>

<style lang="less">
.el-dialog__header{
    background:#3a8ee6;
    .el-dialog__title{
        color:#fff;
    }
    .el-dialog__close{
        color:#fff !important;
    }
}

</style>