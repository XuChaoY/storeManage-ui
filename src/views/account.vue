<!-- 账单管理 -->
<template>
  <div class="accounts">
    <div class="search_form">
      <el-form mode="param" :inline="true">
        <el-form-item label="账单创建时间：">
          <el-date-picker
            v-model="range"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeRangeTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getAccountsList">查询</el-button>
          <el-button plain @click="clearQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data_table">
      <el-table :data="list" border style="width: 100%">
        <el-table-column
          v-for="(item, index) in title"
          :prop="item.prop"
          :label="item.name"
          :key="index"
          :width="item.width"
          align="center"
          :formatter="item.format"
        >
        </el-table-column>
        <el-table-column align="center" width="180">
          <template slot="header" slot-scope>
            <el-button
              type="primary"
              @click="handlerAdd"
              size="mini"
              icon="el-icon-plus"
              >新增</el-button
            >
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <commonDialog
      v-model="dialogVisible"
      :title="accountItem.id ? '修改账单' : '新增账单'"
      @submit="submit()"
    >
      <el-form mode="accountItem" label-width="100px">
        <el-form-item label="账单金额：">
          <el-input
            v-model="accountItem.amount"
            placeholder="请输入货物编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="收款/付款：">
          <el-select v-model="accountItem.type" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款方：" v-if="accountItem.type===0">
          <el-input
            v-model="accountItem.payee"
            placeholder="收款方"
          ></el-input>
        </el-form-item>
        <el-form-item label="付款方：" v-else>
          <el-input v-model="accountItem.payer" placeholder="付款方"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input
            v-model="accountItem.tel"
            placeholder="联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item label="钱款用途：">
          <el-input
            v-model="accountItem.purpose"
            placeholder="钱款用途"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="accountItem.remark"
            type="textarea"
            rows="4"
            placeholder="备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </commonDialog>
  </div>
</template>

<script>
import http from "@/utils/http";
import moment from "moment";
import lodash from "lodash";
import commonDialog from "@/components/commonDialog";
export default {
    name:'account',
    components:{
      commonDialog
    },
    data(){
      return {
        param:{
          start:null,
          end:null
        },
        list:[],
        accountItem: {
          amount:0,
          type:0,
          payer:"",
          payee:"",
          tel:'',
          purpose:"",
          remark:"",
        },
        dialogVisible: false,
        range:[],
        types:[
          {
            label:'付款',
            value:0
          },
          {
            label:'收款',
            value:1
          }
        ],
        title: [
          {
            prop: "amount",
            name: "账单金额",
            width: 80,
          },
          {
            prop: "payer",
            name: "付款方",
          },
          {
            prop: "payee",
            name: "收款方",
          },
          {
            prop: "tel",
            name: "对方联系方式",
            width: 120,
          },
          {
            prop: "type",
            name: "收款或付款",
            width: 100,
            format: function (row, column, cellValue, index) {
              return cellValue === 0 ? "付款":"收款";
            },
          },
          {
            prop: "purpose",
            name: "钱款用途",
            width: 100,
          },
          {
            prop: "createtime",
            name: "入账时间",
            width: 140,
            format: function (row, column, cellValue, index) {
              return moment(cellValue).format("YYYY-MM-DD HH:mm");
            },
          },
          {
            prop: "remark",
            name: "备注",
          },
        ],
      }
    },
    mounted(){
      this.getAccountsList();
    },
    methods:{
      //获取货物列表
      getAccountsList() {
        http.post("/api/account/list", this.param).then((res) => {
          if (res.errno === 0) {
            this.list = res.data;
          }
        });
      },
      clearQuery() {
        this.param = { start: null, end:null };
        this.range = [];
        this.getAccountsList()
      },
      handlerAdd(){
        if (!this.$store.state.username) {
          this.$message.error("用户未登录，不可操作");
          return;
        }
        this.accountItem = {
          amount:0,
          type:0,
          payer:"",
          payee:"",
          purpose:"",
          tel:'',
          remark:"",
        };
        this.dialogVisible = true;
      },
      handleEdit(index, row){
        if (!this.$store.state.username) {
          this.$message.error("用户未登录，不可操作");
          return;
        }
        this.accountItem = lodash.cloneDeep(row);
        this.dialogVisible = true;
      },
      handleDelete(index, row){
        if (!this.$store.state.username) {
          this.$message.error("用户未登录，不可操作");
          return;
        }
        this.$confirm("确认删除该账单？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            http.post("/api/account/del", { id: row.id }).then((res) => {
              if (res.errno === 0) {
                this.getAccountsList();
                this.$message({
                  message: res.message,
                  type: "success",
                });
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {});
      },
      changeRangeTime(val){
        this.param.start = val[0];
        this.param.end = val[1];
        this.getAccountsList();
      },
      submit(){
        if (!this.accountItem.id) {
        //添加
          http.post("/api/account/add", this.accountItem).then((res) => {
            if (res.errno === 0) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.getAccountsList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          //修改
          http
            .post("/api/account/mod", this.accountItem)
            .then((res) => {
              if (res.errno === 0) {
                this.$message({
                  message: res.message,
                  type: "success",
                });
                this.getAccountsList();
                this.dialogVisible = false;
              } else {
                this.$message.error(res.message);
              }
            });
        }
      }
    }
}
</script>

<style lang="less" scope>
.accounts{
  .search_form {
    padding: 15px 10px;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>