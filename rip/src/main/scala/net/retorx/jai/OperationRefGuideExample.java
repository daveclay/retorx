package net.retorx.jai;
/*
 * $RCSfile: OperationRefGuideExample.java,v $
 *
 * 
 * Copyright (c) 2005 Sun Microsystems, Inc. All  Rights Reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met: 
 * 
 * - Redistribution of source code must retain the above copyright 
 *   notice, this  list of conditions and the following disclaimer.
 * 
 * - Redistribution in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in 
 *   the documentation and/or other materials provided with the
 *   distribution.
 * 
 * Neither the name of Sun Microsystems, Inc. or the names of 
 * contributors may be used to endorse or promote products derived 
 * from this software without specific prior written permission.
 * 
 * This software is provided "AS IS," without a warranty of any 
 * kind. ALL EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND 
 * WARRANTIES, INCLUDING ANY IMPLIED WARRANTY OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT, ARE HEREBY
 * EXCLUDED. SUN MIDROSYSTEMS, INC. ("SUN") AND ITS LICENSORS SHALL 
 * NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF 
 * USING, MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS
 * DERIVATIVES. IN NO EVENT WILL SUN OR ITS LICENSORS BE LIABLE FOR 
 * ANY LOST REVENUE, PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL,
 * CONSEQUENTIAL, INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND
 * REGARDLESS OF THE THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR
 * INABILITY TO USE THIS SOFTWARE, EVEN IF SUN HAS BEEN ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGES. 
 * 
 * You acknowledge that this software is not designed or intended for 
 * use in the design, construction, operation or maintenance of any 
 * nuclear facility. 
 *
 * $Revision: 1.2 $
 * $Date: 2007-04-06 20:23:08 $
 * $State: Exp $
 */

import java.awt.*;
import java.awt.color.*;
import java.awt.geom.*;
import java.awt.image.*;
import java.awt.image.renderable.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.lang.reflect.Array;
import java.util.*;
import javax.media.jai.*;
import javax.media.jai.widget.*;

/**
 * Prints an HTML formatted "JAI Operation Quick Reference"
 */
public class OperationRefGuideExample {

    private final PrintStream out;

    public OperationRefGuideExample(PrintStream out) {
        this.out = out;
    }

    public static void main(String[] args) throws FileNotFoundException {
        PrintStream out;
        if (args.length < 1) {
            out = System.out;
        } else {
            out = new PrintStream(new FileOutputStream(new File(args[0])));
        }

        new OperationRefGuideExample(out).run();
    }

    public void run() {
        OperationRegistry reg =
                JAI.getDefaultInstance().getOperationRegistry();
        String[] opNames = reg.getDescriptorNames(OperationDescriptor.class);

        SortedSet sortedNames = new TreeSet(Arrays.asList(opNames));

        writeHeader("JAI Operation Quick Reference");

        out.println("<p>JAI version: " + JAI.getBuildVersion() + "</p>");

        Locale locale = Locale.getDefault();

        Iterator nameIter = sortedNames.iterator();
        while (nameIter.hasNext()) {

            String name = (String) nameIter.next();
            OperationDescriptor desc =
                    (OperationDescriptor) reg.getDescriptor(OperationDescriptor.class,
                            name);
            String[][] resources = desc.getResources(locale);

            String url = getResource("DocURL", resources);
            out.println("<br><a href=\"" + url + "\"><h3>" +
                    desc.getName() + "</h3></a>");

            out.println(getResource("Description", resources));
            out.println("<br><br>Version: " +
                    getResource("Version", resources));
            out.println("<br>Vendor: " +
                    getResource("Vendor", resources));

            String[] modes = desc.getSupportedModes();

            out.print("<br>Supported modes:");
            for (int i = 0; i < modes.length; i++) {
                if (i == 0) {
                    out.print(" ");
                } else {
                    out.print(", ");
                }
                out.print(modes[i]);
            }
            out.println("");

            int numSources = desc.getNumSources();

            for (int i = 0; i < modes.length; i++) {
                out.println("<p><h4>" + modes[i] + " mode</h4>");
                if (numSources > 0) {
                    out.println("<p><table border=1>");

                    out.println("<caption>" + modes[i] +
                            " mode sources</caption>");

                    out.println("<tr><th>Name</th>" +
                            "<th>Class</th>");

                    String[] sourceNames = desc.getSourceNames();
                    Class[] sourceClasses = desc.getSourceClasses(modes[i]);

                    for (int j = 0; j < numSources; j++) {
                        out.print("<tr>");
                        out.print("<td>" + sourceNames[j] + "</td>");
                        out.print("<td>" + sourceClasses[j].getName() +
                                "</td>");
                        out.print("</tr>");
                    }

                    out.println("</table></p>");
                }

                ParameterListDescriptor pld =
                        desc.getParameterListDescriptor(modes[i]);

                int numParameters = pld.getNumParameters();

                if (numParameters > 0) {
                    out.println("<p><table border=1>");

                    out.println("<caption>" + modes[i] +
                            " mode parameters</caption>");

                    out.println("<tr><th>Name</th>" +
                            "<th>Description</th>" +
                            "<th>Class</th>" +
                            "<th>Default</th>");

                    String[] paramNames = pld.getParamNames();
                    Class[] paramClasses = pld.getParamClasses();
                    Object[] paramDefaults = pld.getParamDefaults();

                    for (int j = 0; j < numParameters; j++) {
                        out.print("<tr>");
                        out.print("<td>" + paramNames[j] + "</td>");
                        out.print("<td>" +
                                getResource("arg" + j + "Desc",
                                        resources) +
                                "</td>");
                        out.print("<td>" +
                                paramClasses[j].getName() +
                                "</td>");
                        String defaultString = null;
                        Object defaultValue = paramDefaults[j];
                        if (defaultValue == null) {
                            defaultString = "DERIVED";
                        } else if (defaultValue ==
                                ParameterListDescriptor.NO_PARAMETER_DEFAULT) {
                            defaultString = "NONE";
                        } else if (defaultValue.getClass().isArray()) {
                            defaultString = "{ ";
                            int maxIndex = Array.getLength(defaultValue) - 1;
                            for (int index = 0; index <= maxIndex; index++) {
                                defaultString += Array.get(defaultValue, index);
                                if (index != maxIndex) defaultString += ", ";
                            }
                            defaultString += " }";
                        } else {
                            defaultString = defaultValue.toString();
                        }
                        out.print("<td>" + defaultString + "</td>");
                        out.print("</tr>");
                    }

                    out.println("</table></p>");
                }

                out.println("<p><table border=1>");

                out.println("<caption>" + modes[i] +
                        " mode factories</caption>");

                out.println("<tr><th>Index</th>" +
                        "<th>Class</th>");

                Iterator factoryIter = reg.getFactoryIterator(modes[i], name);
                int index = 1;
                while (factoryIter.hasNext()) {
                    out.print("<tr>");
                    out.print("<td>" + (index++) + "</td>");
                    out.print("<td>" +
                            factoryIter.next().getClass().getName() +
                            "</td>");
                    out.print("</tr>");
                }

                out.println("</table></p>");
            }

            out.println("</p><br>");
        }

        writeFooter("jai-comments@sun.com");
    }

    private String getResource(String resource, String[][] resources) {
        int numResources = resources.length;
        String resourceValue = null;
        for (int i = 0; i < numResources; i++) {
            if (resource.equalsIgnoreCase(resources[i][0])) {
                resourceValue = resources[i][1];
            }
        }
        if (resourceValue == null) {
            throw new RuntimeException("Resource " + resource + " not found.");
        }
        return resourceValue;
    }

    private void writeHeader(String title) {
        out.println("<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML//EN\">");
        out.println("<html>");
        out.println("<head><title>" + title + "</title></head>");
        out.println("<body><h1>" + title + "</h1>");
    }

    private void writeFooter(String address) {
        out.println("<hr>");
        out.println("<address><a href=mailto:" +
                address + ">" + address + "</a></address>");
        out.println("<!-- hhmts start -->");
        out.println("Last modified: " + Calendar.getInstance().getTime());
        out.println("<!-- hhmts end -->");
        out.println("</body></html>");
    }
}
