<!-- 货物管理 -->
<template>
  <div class="goods">
    <div class="search_form">
      <el-form mode="param" :inline="true">
        <el-form-item label="货物名称：">
          <el-input v-model="param.name" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getGoodsList">查询</el-button>
          <el-button plain @click="clearQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data_table">
      <el-table :data="list" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.records" border style="width: 100%">
              <el-table-column
                v-for="(item, index) in title2"
                :prop="item.prop"
                :label="item.name"
                :key="index"
                :width="item.width"
                align="center"
                :formatter="item.format"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
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
      :title="goodItem.id ? '修改货物' : '新增货物'"
      @submit="submit()"
    >
      <el-form mode="goodItem">
        <el-form-item label="货物编号：">
          <el-input
            v-model="goodItem.identifier"
            placeholder="请输入货物编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="货物名称：">
          <el-input v-model="goodItem.name" placeholder="货物名称"></el-input>
        </el-form-item>
        <el-form-item label="货物数量：">
          <el-input
            v-model="goodItem.quantity"
            placeholder="货物数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model="goodItem.remark"
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
  name: "goods",
  components: {
    commonDialog,
  },
  data() {
    return {
      param: {
        name: "",
      },
      props: {},
      goodItem: {},
      dialogVisible: false,
      preNum: 0,
      list: [],
      title: [
        {
          prop: "identifier",
          name: "货物编号",
          width: 120,
        },
        {
          prop: "name",
          name: "货物名称",
        },
        {
          prop: "quantity",
          name: "货物数量",
          width: 80,
        },
        {
          prop: "modifytime",
          name: "最近修改时间",
          format: function (row, column, cellValue, index) {
            return moment(cellValue).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          prop: "modifyperson",
          name: "最近修改人",
          width: 100,
        },
        {
          prop: "remark",
          name: "备注",
        },
      ],
      title2: [
        {
          prop: "identifier",
          name: "货物编号",
        },
        {
          prop: "gName",
          name: "货物名称",
        },
        {
          prop: "operate",
          name: "操作方式",
          format: function (row, column, cellValue, index) {
            return cellValue === 1 ? "入库" : cellValue === 2 ? "入库" : "";
          },
        },
        {
          prop: "num",
          name: "操作数量",
        },
        {
          prop: "createtime",
          name: "操作时间",
          format: function (row, column, cellValue, index) {
            return moment(cellValue).format("YYYY-MM-DD HH:mm");
          },
        },
        {
          prop: "person",
          name: "操作人",
        },
      ],
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    //获取货物列表
    getGoodsList() {
      http.post("/api/goods/list", this.param).then((res) => {
        if (res.errno === 0) {
          this.list = res.data;
        }
      });
    },
    clearQuery() {
      this.param = { name: "" };
    },
    //新增货物
    handlerAdd() {
      if (!this.$store.state.username) {
        this.$message.error("用户未登录，不可操作");
        return;
      }
      this.goodItem = {};
      this.dialogVisible = true;
    },
    //添加货物入库
    submit() {
      if (!this.goodItem.id) {
        //添加
        http.post("/api/goods/add", this.goodItem).then((res) => {
          if (res.errno === 0) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.getGoodsList();
            this.dialogVisible = false;
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        //修改
        http
          .post("/api/goods/mod", {
            ...this.goodItem,
            changeNum: this.preNum - this.goodItem.quantity,
          })
          .then((res) => {
            if (res.errno === 0) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.getGoodsList();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    //修改货物列表
    handleEdit(index, row) {
      if (!this.$store.state.username) {
        this.$message.error("用户未登录，不可操作");
        return;
      }
      this.preNum = row.quantity;
      this.goodItem = lodash.cloneDeep(row);
      this.dialogVisible = true;
    },
    //删除货物
    handleDelete(index, row) {
      if (!this.$store.state.username) {
        this.$message.error("用户未登录，不可操作");
        return;
      }
      this.$confirm("确认删除该货物？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http.post("/api/goods/del", { id: row.id }).then((res) => {
            if (res.errno === 0) {
              this.getGoodsList();
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
  },
};
</script>

<style lang="less" scope>
.goods {
  .search_form {
    padding: 15px 10px;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>