using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedImgUrlToCourses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isApproved",
                table: "Courses",
                newName: "IsApproved");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Professors",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ImgUrl",
                table: "Courses",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Professors");

            migrationBuilder.DropColumn(
                name: "ImgUrl",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "IsApproved",
                table: "Courses",
                newName: "isApproved");
        }
    }
}
