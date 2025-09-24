using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElectiaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedCourseProfessorRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Professors_MainProfessorUserId",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Professors_Courses_CourseId",
                table: "Professors");

            migrationBuilder.DropIndex(
                name: "IX_Professors_CourseId",
                table: "Professors");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Professors");

            migrationBuilder.RenameColumn(
                name: "MainProfessorUserId",
                table: "Courses",
                newName: "MainProfessorId");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_MainProfessorUserId",
                table: "Courses",
                newName: "IX_Courses_MainProfessorId");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Majors",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Faculties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Centers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "CourseCollaboratingProfessors",
                columns: table => new
                {
                    CollaboratingCoursesId = table.Column<int>(type: "int", nullable: false),
                    CollaboratingProfessorsUserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCollaboratingProfessors", x => new { x.CollaboratingCoursesId, x.CollaboratingProfessorsUserId });
                    table.ForeignKey(
                        name: "FK_CourseCollaboratingProfessors_Courses_CollaboratingCoursesId",
                        column: x => x.CollaboratingCoursesId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseCollaboratingProfessors_Professors_CollaboratingProfessorsUserId",
                        column: x => x.CollaboratingProfessorsUserId,
                        principalTable: "Professors",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Centers",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Centers",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 4,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Faculties",
                keyColumn: "Id",
                keyValue: 6,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 4,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 5,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 6,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 7,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 8,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 9,
                column: "IsDeleted",
                value: false);

            migrationBuilder.UpdateData(
                table: "Majors",
                keyColumn: "Id",
                keyValue: 10,
                column: "IsDeleted",
                value: false);

            migrationBuilder.CreateIndex(
                name: "IX_CourseCollaboratingProfessors_CollaboratingProfessorsUserId",
                table: "CourseCollaboratingProfessors",
                column: "CollaboratingProfessorsUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Professors_MainProfessorId",
                table: "Courses",
                column: "MainProfessorId",
                principalTable: "Professors",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Professors_MainProfessorId",
                table: "Courses");

            migrationBuilder.DropTable(
                name: "CourseCollaboratingProfessors");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Majors");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Faculties");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Centers");

            migrationBuilder.RenameColumn(
                name: "MainProfessorId",
                table: "Courses",
                newName: "MainProfessorUserId");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_MainProfessorId",
                table: "Courses",
                newName: "IX_Courses_MainProfessorUserId");

            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "Professors",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Professors_CourseId",
                table: "Professors",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Professors_MainProfessorUserId",
                table: "Courses",
                column: "MainProfessorUserId",
                principalTable: "Professors",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Professors_Courses_CourseId",
                table: "Professors",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id");
        }
    }
}
